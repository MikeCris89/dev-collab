import { RequestHandler } from "express";
import { BadRequestError } from "./errors.js";

export const testNote = {
	id: "1",
	title: "Hello",
	content: "World",
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
	if (!onlyKeys(note, ["title", "content"]))
		throw new BadRequestError("Only 'title' and 'content' are allowed.");

	// Check property types and
	if (typeof note.title !== "string" || note.title.trim().length === 0)
		throw new BadRequestError("title must be a non-empty string.");
	if (typeof note.content !== "string" || note.content.trim().length === 0)
		throw new BadRequestError("content must be a non-empty string.");

	next();
};
