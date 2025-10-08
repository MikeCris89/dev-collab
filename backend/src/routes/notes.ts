import express, { Request, Response } from "express";
import { NotFoundError } from "../lib/errors.js";
import { testNote, validateNoteInput } from "../lib/utils.js";
import notesTestData from "../../../fixtures/notes.json" with {type: "json"};
import { JwtUser, Note, NoteInput } from "@shared/contract";

const testNotes: Note[] = notesTestData;

const router = express.Router();

router.get("/", async (req: Request, res: Response<Note[]>) => {
	const user = req.user as JwtUser;

	// TODO fetch notes from db
	const data = await Promise.resolve(testNotes ?? undefined);
	if (!data) throw new NotFoundError();

	res.json(data[user.sub] ?? []);
});

router.get("/:id",  async (req: Request, res: Response<Note>) => {
	const user = req.user as JwtUser;
	const { id } = req.params;

	// TODO find note by id
	const notes = await Promise.resolve(testNotes);
	if (!notes) throw new NotFoundError();
	
	const data = notes[user.sub]?.find(el => el.id === id);
	if (!data) throw new NotFoundError();

	res.json();
});

router.post(
	"/",
	validateNoteInput,
	async (req: Request, res: Response<Note>) => {
		const user = req.user as JwtUser;
		const body = req.body as NoteInput;

		// TODO create note
		const newNote: Note = {
			id: String(Math.random() * 100),
			...body,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
		const data = await Promise.resolve(newNote);
		if (!data) throw new NotFoundError();

		res.setHeader("Location", `/api/notes/${data.id}`);
		res.status(201).json(data);
	}
);

router.put(
	"/:id",
	validateNoteInput,
	async (req: Request, res: Response<Note>) => {
		const user = req.user as JwtUser;
		const body = req.body as NoteInput;
		const { id } = req.params;

		// TODO update note
		const data = await Promise.resolve(testNote);
		if (!data) throw new NotFoundError();

		res.json(data);
	}
);

router.delete("/:id", (req, res) => {
	const user = req.user as JwtUser;
	const { id } = req.params;

	res.status(204).end();
});

export default router;
