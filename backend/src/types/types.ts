import { JwtUser } from "@shared/contract";
import { Request } from "express";
import { UnauthorizedError } from "../lib/errors.js";

// ==== BACKEND ONLY ====
// =======================

export type AuthReq = Omit<Request, "user"> & { user: JwtUser };

export function assertAuth(req: Request): asserts req is AuthReq {
	if (!isAuth(req)) throw new UnauthorizedError();
}

export const isAuth = (req: Request): req is AuthReq =>
	!!req.user &&
	typeof req.user === "object" &&
	typeof (req.user as any).sub === "string";

export const reqUser = (req: Request): JwtUser => {
	const user = req.user;
	if (!user || !user.teamId || !user.role) throw new UnauthorizedError();
	return user;
};
