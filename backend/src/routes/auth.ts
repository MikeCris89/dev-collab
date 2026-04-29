import express, { Response } from "express";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
import jwt from "jsonwebtoken";
import { requireAuth } from "../lib/middleware.js";
import { CreateUserDTO, ROLES } from "@shared/contract";
import { userQueries } from "../db/queries/index.js";
import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import { sanitizeAuthUser, validateUserInput } from "src/lib/utils.js";

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "strict" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days to match the token
};

const router = express.Router();

const resetSession = (res: Response, token?: string) => {
	res.clearCookie("session", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	if (token) {
		res.cookie("session", token, COOKIE_OPTIONS);
	}
};

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
				isAdmin: user.role === ROLES.admin,
			},
			secret,
			{
				expiresIn: "7d",
			},
		);
	} catch (e) {
		console.log("token error: ", e);
		throw new Error("Failed to generate authentication token");
	}

	return token;
};

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 10);
};

router.get("/me", requireAuth, async (req, res) => {
	const user = reqUser(req);

	const resp = await prisma.user.findUnique({
		where: { id: user.sub, teamId: user.teamId },
	});

	if (!resp) throw new UnauthorizedError("Account not found");

	// Prevent browser caching
	res.setHeader(
		"Cache-Control",
		"no-store, no-cache, must-revalidate, private",
	);
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");

	console.log("User Authenticated: ", user);

	res.json(user);
});

router.post("/signup", validateUserInput, async (req, res) => {
	const userInput = req.body as CreateUserDTO;
	const { username, password, name } = userInput;

	const existing = await userQueries.getByUsername(username);

	if (existing) throw new BadRequestError("Username taken");

	const hash = await hashPassword(password);

	const user = await userQueries.createUser({
		username,
		password: hash,
		name: name ?? null,
		role: ROLES.admin,
	});

	const token = getToken(user);

	resetSession(res, token);

	const userData = sanitizeAuthUser(user);

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

	resetSession(res, token);

	const userData = sanitizeAuthUser(user);

	res.json(userData);
});

router.post("/logout", (_req, res) => {
	resetSession(res);

	res.end();
});

export default router;
