import express, { Request, Response } from "express";
import type { Note, NoteInput } from "../lib/types.js";
import { NotFoundError } from "../lib/errors.js";
import { testNote, validateNoteInput } from "../lib/utils.js";

const router = express.Router();

router.get("/", async (_req, res: Response<Note[]>) => {
	const data = await Promise.resolve(testNote);
	if (!data) throw new NotFoundError();

	res.json([data]);
});

router.get("/:id", async (req, res: Response<Note>) => {
	const { id } = req.params;

	const data = await Promise.resolve(testNote);
	if (!data) throw new NotFoundError();

	res.json(data);
});

router.post(
	"/",
	validateNoteInput,
	async (req: Request, res: Response<Note>) => {
		const body = req.body as NoteInput;

		const data = await Promise.resolve(testNote);
		if (!data) throw new NotFoundError();

		res.setHeader("Location", `/api/notes/${data.id}`);
		res.status(201).json(data);
	}
);

router.put(
	"/:id",
	validateNoteInput,
	async (req: Request, res: Response<Note>) => {
		const { id } = req.params;
		const body = req.body as NoteInput;

		const data = await Promise.resolve(testNote);
		if (!data) throw new NotFoundError();

		res.json(data);
	}
);

router.delete("/:id", (req, res) => {
	const { id } = req.params;

	res.status(204).end();
});

export default router;
