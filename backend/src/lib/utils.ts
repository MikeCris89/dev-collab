import { RequestHandler } from "express";
import { BadRequestError } from "./errors.js";
import {
	CreateUserDTO,
	FolderInput,
	JwtUser,
	LIMITS,
	NoteInput,
	ProjectInput,
	ROLES,
} from "@shared/contract";
import type { User } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

export const sanitizeHTML = (html: string): string => {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"p",
			"strong",
			"em",
			"u",
			"s", // strikethrough
			"h1",
			"h2",
			"h3",
			"ul",
			"ol",
			"li",
			"a",
			"blockquote",
			"code",
			"pre",
			"br",
			"label", // For task lists
			"input", // For checkboxes
			"div", // TipTap uses divs
			"span", // TipTap uses spans
		],
		ALLOWED_ATTR: [
			"href",
			"target",
			"data-type", // TipTap uses this for task lists
			"data-checked", // TipTap uses this for checkbox state
			"type", // For input type="checkbox"
			"checked", // For checked checkboxes
			"class", // May be needed for styling
		],
	});
};

export const sanitizePlainText = (text: string): string => {
	return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

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

	req.body.title = sanitizePlainText(trimTitle);
	req.body.body = sanitizeHTML(trimBody);

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

	if (trimTitle.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	req.body.title = sanitizePlainText(trimTitle);

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

	if (trimTitle.length > LIMITS.TITLE_MAX_LENGTH)
		throw new BadRequestError(
			`Title must be ${LIMITS.TITLE_MAX_LENGTH} characters or less`
		);

	req.body.title = sanitizePlainText(trimTitle);

	next();
};

export const validateUserInput: RequestHandler = (req, _res, next) => {
	const { username, password, name } = req.body as CreateUserDTO;

	const trimUsername = username.trim();
	const trimName = name?.trim() || null;

	if (typeof trimUsername !== "string" || trimUsername.length === 0) {
		throw new BadRequestError("Username is required");
	}

	if (
		typeof password !== "string" ||
		password.length < LIMITS.PASSWORD_MIN_LENGTH
	) {
		throw new BadRequestError(
			`Password must be at least ${LIMITS.PASSWORD_MIN_LENGTH} characters`
		);
	}

	if (trimUsername.length > LIMITS.USERNAME_MAX_LENGTH)
		throw new BadRequestError(
			`Username must be ${LIMITS.USERNAME_MAX_LENGTH} characters or less`
		);

	if (trimName && trimName.length > LIMITS.NAME_MAX_LENGTH)
		throw new BadRequestError(
			`Name must be ${LIMITS.NAME_MAX_LENGTH} characters or less`
		);

	req.body.username = sanitizePlainText(trimUsername);
	req.body.name = trimName ? sanitizePlainText(trimName) : null;

	next();
};

export const sanitizeTeamUser = (user: User) => {
	const { password: _p, teamId: _t, ...member } = user;
	return member;
};

export const sanitizeAuthUser = (user: User): JwtUser => {
	return {
		sub: user.id,
		username: user.username,
		isAdmin: user.role === ROLES.admin,
		teamId: user.teamId,
		role: user.role,
	};
};
