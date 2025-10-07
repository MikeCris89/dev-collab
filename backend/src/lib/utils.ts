import { RequestHandler } from "express";
import { BadRequestError } from "./errors.js";
import { JwtUser, ROLES, Roles, TeamMember } from "@shared/contract";
import type { User } from "@prisma/client";

export const testNote = {
	id: "1",
	title: "Hello",
	body: "World",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export const onlyKeys = (obj: object, allowed: string[]) =>
	Object.keys(obj).every((k) => allowed.includes(k));

// Validation
export const validateNoteInput: RequestHandler = (req, _res, next) => {
	const note = req.body;

	// Check for object type and properties
	if (!note || typeof note !== "object")
		throw new BadRequestError("Body must be an object.");
	if (!onlyKeys(note, ["title", "body"]))
		throw new BadRequestError("Only 'title' and 'body' are allowed.");

	// Check property types and
	if (typeof note.title !== "string" || note.title.trim().length === 0)
		throw new BadRequestError("title must be a non-empty string.");
	if (typeof note.body !== "string" || note.body.trim().length === 0)
		throw new BadRequestError("Body must be a non-empty string.");

	next();
};

export const isAdmin = (role: Roles) => role === ROLES.admin;

export const sanitizeTeamUser = (user: User) => {
	const { password: _p, teamId: _t, ...member } = user;
	return member;
};
