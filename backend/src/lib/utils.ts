import { RequestHandler } from "express";
import { BadRequestError } from "./errors.js";
import { LIMITS } from "@shared/contract";
import type { User } from "@prisma/client";

// Note Validation
export const validateNoteInput: RequestHandler = (req, _res, next) => {
	const note = req.body;
	const { title, body } = note;

	// Check for object type and properties
	if (!note || typeof note !== "object")
		throw new BadRequestError("Body must be an object.");

	// Check property types and
	if (typeof title !== "string" || title.trim().length === 0)
		throw new BadRequestError("title must be a non-empty string.");

	if (typeof body !== "string" || body.trim().length === 0)
		throw new BadRequestError("Body must be a non-empty string.");

	if (title.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	if (body.length > LIMITS.NOTE_BODY_MAX_LENGTH) {
		throw new BadRequestError(
			`Body must be ${LIMITS.NOTE_BODY_MAX_LENGTH} characters or less`
		);
	}

	next();
};

// Folder Validation
export const validateFolderInput: RequestHandler = (req, _res, next) => {
	const folder = req.body;
	const { title } = folder;

	// Check for object type and properties
	if (!folder || typeof folder !== "object")
		throw new BadRequestError("Body must be an object.");

	// Check property types and
	if (typeof title !== "string" || title.trim().length === 0)
		throw new BadRequestError("Title must be a non-empty string.");

	if (title.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	next();
};

// Project Validation
export const validateProjectInput: RequestHandler = (req, _res, next) => {
	const project = req.body;
	const { title } = project;

	// Check for object type and properties
	if (!project || typeof project !== "object")
		throw new BadRequestError("Body must be an object.");

	// Check property types and
	if (typeof title !== "string" || title.trim().length === 0)
		throw new BadRequestError("Title must be a non-empty string.");

	if (title.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	next();
};

export const sanitizeTeamUser = (user: User) => {
	const { password: _p, teamId: _t, ...member } = user;
	return member;
};
