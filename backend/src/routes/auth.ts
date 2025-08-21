import express from "express";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	// TODO: look up user in DB and bcrypt.compare(password, user.password_hash)
	const user = await Promise.resolve({ id: "123", username });

	if (!user) throw new UnauthorizedError("User not found");

	const token = jwt.sign(
		{ sub: user.id, username: user.username },
		process.env.JWT_TOKEN!,
		{ expiresIn: "45m" }
	);

	res.cookie("session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		maxAge: 1000 * 60 * 45,
	});

	res.status(204).end();
});

router.post("/logout", (_req, res) => {
	res.clearCookie("session", { httpOnly: true, secure: true, sameSite: "lax" });
	res.end();
});

export default router;
