import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError, UnauthorizedError } from "./errors.js";
import { JwtUser, ROLES, Roles } from "@shared/contract";
import { reqUser } from "src/types/types.js";
import { Prisma } from "@prisma/client";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json(err.serialize());
	}

	// Prisma errors
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2025") {
			return res.status(404).json({ message: "Record not found" }); // ← This catches it
		}
	}

	const isProd = process.env.NODE_ENV === "production";
	const message = err instanceof Error ? err.message : "Internal server error";
	const stack = err instanceof Error ? err.stack : "no stack trace";

	return res.status(500).json({
		message: message,
		...(isProd ? {} : { error: stack }),
	});
};

export const requireAuth: RequestHandler = (req, _res, next) => {
	const token = req.cookies?.session;
	if (!token) throw new UnauthorizedError("Auth Required");

	try {
		// TODO get user info: {uid: string, username: string}
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as jwt.JwtPayload & JwtUser;
		// normalize
		req.user = {
			sub: String(payload.sub),
			role: String(payload.role) as Roles,
			teamId: String(payload.teamId),
		};

		next();
	} catch (e) {
		throw new UnauthorizedError("Invalid or Expired Session");
	}
};

export const adminOnly: RequestHandler = (req, _res, next) => {
	const { role } = reqUser(req);

	if (!role || role !== ROLES.admin) throw new UnauthorizedError();

	next();
};
