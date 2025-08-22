import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError, UnauthorizedError } from "./errors.js";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json(err.serialize());
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
		const payload = jwt.verify(token, process.env.JWT_SECRET!);
		(req as any).user = payload;
		next();
	} catch (e) {
		throw new UnauthorizedError("Invalid or Expired Session");
	}
};
