import { Request } from "express";
import { UnauthorizedError } from "../lib/errors.js";
import { Role } from "@prisma/client";

export interface NoteInput {
	title: string;
	content: string;
}

export interface Note extends NoteInput {
	id: string;
	createdAt: string;
	updatedAt: string;
}

export const ROLES = {
	admin: "ADMIN",
	team: "TEAM",
} as const;

export interface User {
	id: string;
	username: string;
	role: Role;
}

export type JwtUser = { sub: string; role: Role; teamId: string };

// ==== BACKEND ONLY ====
// =======================

// export type AuthReq = Request & { user: JwtUser };
export type AuthReq = Omit<Request, "user"> & { user: JwtUser };

export function assertAuth(req: Request): asserts req is AuthReq {
	if (!isAuth(req)) throw new UnauthorizedError();
}

export const isAuth = (req: Request): req is AuthReq =>
	!!req.user &&
	typeof req.user === "object" &&
	typeof (req.user as any).sub === "string";
