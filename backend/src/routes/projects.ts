import { LIMITS } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import { ProjectInput, ROLES } from "@shared/contract";
import { BadRequestError, NotFoundError } from "src/lib/errors.js";
import { validateProjectInput } from "src/lib/utils.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
	const { teamId, role, sub } = reqUser(req);
	const { id } = req.params;

	const project = await prisma.project.findFirst({
		where:
			role === ROLES.admin
				? { id, teamId }
				: { id, teamId, projectsUsers: { some: { userId: sub } } },

		select: {
			id: true,
			folders: {
				include: {
					notes: true,
				},
			},
		},
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	res.json(project);
});

// Admin Only Actions

router.use(adminOnly);

router.delete("/:id", async (req, res) => {
	const { teamId } = reqUser(req);

	const { id } = req.params;

	await prisma.project.delete({
		where: { id, teamId },
	});

	res.status(204).send();
});

router.use(validateProjectInput);

router.post("/", async (req, res) => {
	const { teamId } = reqUser(req);

	const projectCount = await prisma.project.count({
		where: { teamId },
	});

	if (projectCount >= LIMITS.MAX_PROJECTS_PER_TEAM)
		throw new BadRequestError(
			`Maximum of ${LIMITS.MAX_PROJECTS_PER_TEAM} per team.`
		);

	const body: ProjectInput = req.body;

	// Create project - apply project permission for users
	const resp = await prisma.project.create({
		data: {
			title: body.title,
			teamId,
			projectsUsers: {
				create: body.userIds?.map((userId) => ({ userId })) || [],
			},
		},
	});

	res.json(resp);
});

router.put("/:id", async (req, res) => {
	const { teamId } = reqUser(req);
	const { id } = req.params as { id: string };

	const body: ProjectInput = req.body;

	const resp = await prisma.project.update({
		where: { id, teamId },
		data: {
			title: body.title,
			projectsUsers: {
				deleteMany: {},
				create: body.userIds?.map((userId) => ({ userId })) || [],
			},
		},
		include: { projectsUsers: true },
	});

	res.json(resp);
});

export default router;
