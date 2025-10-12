import { FolderInput } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import prisma from "../db/client.js";
import { BadRequestError } from "src/lib/errors.js";
import { reqUser } from "src/types/types.js";
const router = express.Router();

router.use(adminOnly);

router.post("/", async (req, res) => {
	const { teamId } = reqUser(req);
	const body: FolderInput = req.body;

	const { title, projectId } = body;

	if (!title || !projectId)
		throw new BadRequestError("Title and Project ID are required");

	if (title.length > 50)
		throw new BadRequestError("Title must be 50 characters or less");

	const resp = await prisma.folder.create({
		data: {
			title,
			project: {
				connect: {
					id_teamId: {
						id: projectId,
						teamId,
					},
				},
			},
		},
	});

	res.json(resp);
});

router.put("/:id", async (req, res) => {
	const { teamId } = reqUser(req);
	const body: FolderInput = req.body;
	const { id } = req.params;

	const { title, projectId } = body;

	if (!title || !projectId)
		throw new BadRequestError("Title and Project ID are required");

	if (body.title.length > 50)
		throw new BadRequestError("Title must be 50 characters or less");

	const resp = await prisma.folder.updateMany({
		where: { id, projectId, project: { is: { teamId } } },
		data: body,
	});
	if (resp.count !== 1) throw new Error("Not found/forbidden");

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
