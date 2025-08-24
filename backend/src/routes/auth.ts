import express from "express";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
import jwt from "jsonwebtoken";
import { requireAuth } from "../lib/middleware.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
	const user = (req as any).user;
	res.json(user);
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	// TODO: look up user in DB and bcrypt.compare(password, user.password_hash)
	const user = await Promise.resolve({ id: "1234", username });

	if (!user) throw new UnauthorizedError("Invalid Credentials");
	let token;
	const secret = process.env.JWT_SECRET!;
	console.log("secret", secret);
	try {
		token = jwt.sign({ sub: user.id, username: user.username }, secret, {
			expiresIn: "45m",
		});
	} catch (e) {
		console.log("token error: ", e);
	}

	console.log("TOKEN", token);

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
