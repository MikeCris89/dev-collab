import express, { RequestHandler } from "express";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { validateNoteInput } from "../lib/utils.js";
import { NoteInput } from "@shared/contract";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";

type NoteParams = {
	folderId: string;
	noteId: string;
};

const router = express.Router();

const validateFolder: RequestHandler = async (req, _res, next) => {
	const { teamId } = reqUser(req);
	const { folderId } = req.params;

	if (!folderId) throw new BadRequestError("Missing folder ID");

	const valid = await prisma.folder.findFirst({
		where: { id: folderId, project: { teamId } },
	});

	if (!valid) throw new NotFoundError("Folder not found");

	next();
};

router.delete("/:folderId/:noteId", validateFolder, async (req, res) => {
	const { noteId, folderId } = req.params as NoteParams;

	await prisma.note.delete({
		where: { id: noteId, folderId },
	});

	res.status(204).end();
});

router.use(validateNoteInput);

router.post("/:folderId", validateFolder, async (req, res) => {
	const { sub: userId } = reqUser(req);
	const { folderId } = req.params as { folderId: string };
	const { title, body }: NoteInput = req.body;

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

router.put("/:folderId/:noteId", validateFolder, async (req, res) => {
	const { sub: userId } = reqUser(req);
	const { noteId, folderId } = req.params as NoteParams;
	const body: NoteInput = req.body;

	const resp = await prisma.note.update({
		where: { id: noteId, userId, folderId },
		data: body,
	});

	res.json(resp);
});

export default router;
