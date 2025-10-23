import { FolderInput, LIMITS } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import prisma from "../db/client.js";
import { BadRequestError, NotFoundError } from "src/lib/errors.js";
import { reqUser } from "src/types/types.js";
import { validateFolderInput } from "src/lib/utils.js";

const router = express.Router();

router.use(adminOnly);

router.param("projectId", async (req, _res, next, projectId) => {
	const { teamId } = reqUser(req);
	// const { projectId } = req.params;

	console.log("PROJECTID:", projectId, req);

	if (!projectId) throw new BadRequestError("Missing Project ID");

	const valid = await prisma.project.findFirst({
		where: { id: projectId, teamId },
	});

	if (!valid) throw new NotFoundError("Project not found");

	next();
});

// DELETE
router.delete("/:projectId/:folderId", async (req, res) => {
	const { folderId, projectId } = req.params;

	await prisma.folder.delete({
		where: { id: folderId, projectId },
	});

	res.status(204).send();
});

router.use(validateFolderInput);

router.post("/:projectId", async (req, res) => {
	const { projectId } = req.params;
	const body: FolderInput = req.body;
	const { title } = body;

	const count = await prisma.folder.count({
		where: { projectId },
	});

	if (count >= LIMITS.MAX_FOLDERS_PER_PROJECT)
		throw new BadRequestError(
			`Maximum of ${LIMITS.MAX_FOLDERS_PER_PROJECT} per project.`
		);

	const resp = await prisma.folder.create({
		data: {
			title,
			projectId,
		},
	});

	res.status(201).json(resp);
});

router.put("/:projectId/:folderId", async (req, res) => {
	const body: FolderInput = req.body;
	const { folderId, projectId } = req.params;

	const resp = await prisma.folder.update({
		where: { id: folderId, projectId },
		data: body,
	});

	res.json(resp);
});

export default router;
