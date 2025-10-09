import { FolderInput } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import prisma from "../db/client.js";
import { BadRequestError } from "src/lib/errors.js";
const router = express.Router();

router.use(adminOnly);

router.post("/", async (req, res) => {
	const body: FolderInput = req.body;

	if (!body.title || !body.projectId)
		throw new BadRequestError("Title and Project ID are required");

	if (body.title.length > 50)
		throw new BadRequestError("Title must be 50 characters or less");

	const resp = await prisma.folder.create({
		data: body,
	});

	res.json(resp);
});

router.put("/:id", async (req, res) => {
	const body: FolderInput = req.body;
	const { id } = req.params;

	const { title, projectId } = body;

	if (!title || !projectId)
		throw new BadRequestError("Title and Project ID are required");

	if (body.title.length > 50)
		throw new BadRequestError("Title must be 50 characters or less");

	const resp = await prisma.folder.update({
		where: { id, projectId },
		data: body,
	});

	res.json(resp);
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	await prisma.folder.delete({
		where: { id },
	});
	res.status(204).send();
});

export default router;
