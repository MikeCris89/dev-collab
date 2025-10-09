import express from "express";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
import jwt from "jsonwebtoken";
import { requireAuth } from "../lib/middleware.js";
import { ROLES } from "@shared/contract";
import { userQueries } from "../db/queries/index.js";
import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";

// const user = await Promise.resolve({
// 	id: "1234",
// 	username,
// 	password,
// 	role: ROLES.admin,
// 	teamId: "4321",
// 	createdAt: new Date(),
// });

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days to match the token
};

const router = express.Router();

const getToken = (user: User) => {
	let token;
	const secret = process.env.JWT_SECRET!;

	try {
		token = jwt.sign(
			{
				sub: user.id,
				username: user.username,
				role: user.role,
				teamId: user.teamId,
			},
			secret,
			{
				expiresIn: "7d",
			}
		);
	} catch (e) {
		console.log("token error: ", e);
		throw new Error("Failed to generate authentication token");
	}

	return token;
};

router.get("/me", requireAuth, async (req, res) => {
	const user = reqUser(req);

	const resp = await prisma.user.findUnique({
		where: { id: user.sub, teamId: user.teamId },
	});

	if (!resp) throw new UnauthorizedError("Account not found");

	res.json(user);
});

router.post("/signup", async (req, res) => {
	const { username, password, name } = req.body;

	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	const existing = await userQueries.getByUsername(username);

	if (existing) throw new BadRequestError("Username taken");

	const hash = await bcrypt.hash(password, 10);

	const user = await userQueries.createUser({
		username,
		password: hash,
		name,
		role: ROLES.admin,
	});

	const token = getToken(user);

	res.cookie("session", token, COOKIE_OPTIONS);

	const { password: _password, ...userData } = user;

	res.status(201).json(userData);
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	const user = await userQueries.getByUsername(username);

	if (!user) throw new UnauthorizedError("Invalid Credentials");

	const match = await bcrypt.compare(password, user.password);

	if (!match) throw new UnauthorizedError("Invalid Credentials");

	const token = getToken(user);

	res.cookie("session", token, COOKIE_OPTIONS);

	const { password: _password, ...userData } = user;

	res.json(userData);
});

router.post("/logout", (_req, res) => {
	res.clearCookie("session", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	res.end();
});

export default router;
