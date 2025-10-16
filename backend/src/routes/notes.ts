import express from "express";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { validateNoteInput } from "../lib/utils.js";
import { NoteInput } from "@shared/contract";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";

const router = express.Router();

router.use(async (req, _res, next) => {
	const { teamId } = reqUser(req);
	const { folderId } = req.params;

	if (!folderId) throw new BadRequestError("Missing folder ID");

	const valid = await prisma.folder.findFirst({
		where: { id: folderId, project: { teamId } },
	});

	if (!valid) throw new NotFoundError("Folder not found");

	next();
});

router.delete("/:folderId/notes/:id", async (req, res) => {
	const { id, folderId } = req.params;

	await prisma.note.delete({
		where: { id, folderId },
	});

	res.status(204).end();
});

router.use(validateNoteInput);

router.post("/:folderId/notes", async (req, res) => {
	const { sub: userId } = reqUser(req);
	const { folderId } = req.params;
	const { title, body } = req.body as NoteInput;

	const resp = await prisma.note.create({
		data: {
			title,
			body,
			userId,
			folderId,
		},
	});

	res.status(201).json(resp);
});

router.put("/:folderId/notes/:id", async (req, res) => {
	const { sub: userId } = reqUser(req);
	const { id, folderId } = req.params;
	const body = req.body as NoteInput;

	const resp = await prisma.note.update({
		where: { id, userId, folderId },
		data: body,
	});

	res.json(resp);
});

export default router;
