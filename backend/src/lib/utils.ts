import { RequestHandler } from "express";
import { BadRequestError } from "./errors.js";
import {
	FolderInput,
	LIMITS,
	LoginRequest,
	NoteInput,
	ProjectInput,
	ROLES,
	SignupRequest,
	UserAuth,
} from "@shared/contract";
import type { User } from "@prisma/client";

// Note Validation
export const validateNoteInput: RequestHandler = (req, _res, next) => {
	const note = req.body as NoteInput;
	const { title, body } = note;

	// Check for object type and properties
	if (!note || typeof note !== "object")
		throw new BadRequestError("Body must be an object.");

	const trimTitle = title.trim();
	const trimBody = body.trim();

	// Check property types and
	if (typeof title !== "string" || trimTitle.length === 0)
		throw new BadRequestError("title must be a non-empty string.");

	if (typeof body !== "string" || trimBody.length === 0)
		throw new BadRequestError("Body must be a non-empty string.");

	if (trimTitle.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	if (trimBody.length > LIMITS.NOTE_BODY_MAX_LENGTH) {
		throw new BadRequestError(
			`Body must be ${LIMITS.NOTE_BODY_MAX_LENGTH} characters or less`
		);
	}

	req.body.title = trimTitle;
	req.body.body = trimBody;

	next();
};

// Folder Validation
export const validateFolderInput: RequestHandler = (req, _res, next) => {
	const folder = req.body as FolderInput;
	const { title } = folder;

	const trimTitle = title.trim();

	// Check for object type and properties
	if (!folder || typeof folder !== "object")
		throw new BadRequestError("Body must be an object.");

	// Check property types and
	if (typeof title !== "string" || trimTitle.length === 0)
		throw new BadRequestError("Title must be a non-empty string.");

	if (title.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	req.body.title = trimTitle;

	next();
};

// Project Validation
export const validateProjectInput: RequestHandler = (req, _res, next) => {
	const project = req.body as ProjectInput;
	const { title } = project;

	const trimTitle = title.trim();

	// Check for object type and properties
	if (!project || typeof project !== "object")
		throw new BadRequestError("Body must be an object.");

	// Check property types and
	if (typeof title !== "string" || trimTitle.length === 0)
		throw new BadRequestError("Title must be a non-empty string.");

	if (title.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	req.body.title = trimTitle;

	next();
};

export const sanitizeTeamUser = (user: User) => {
	const { password: _p, teamId: _t, ...member } = user;
	return member;
};

export const sanitizeAuthUser = (user: User): UserAuth => {
	return {
		sub: user.id,
		isAdmin: user.role === ROLES.admin,
		teamId: user.teamId,
		role: user.role,
	};
};
