import { JwtUser, ROLES } from "@shared/contract";
import { Request } from "express";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";

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

// keep in types.ts for TS to recognize req.user
export const reqUser = (req: Request): JwtUser & { isAdmin: boolean } => {
	const user = req.user;

	if (!user || !user.teamId || !user.role)
		throw new BadRequestError("Missing user data");

	const isAdmin = user.role === ROLES.admin;

	return { ...user, isAdmin };
};
