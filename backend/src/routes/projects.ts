import { LIMITS } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import { ProjectInput, ROLES } from "@shared/contract";
import { BadRequestError, NotFoundError } from "src/lib/errors.js";

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
			folders: true,
			notes: true,
		},
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	res.json(project);
});

router.post("/", adminOnly, async (req, res) => {
	const { teamId } = reqUser(req);

	const projectCount = await prisma.project.count({
		where: { teamId },
	});

	if (projectCount >= LIMITS.MAX_PROJECTS_PER_TEAM)
		throw new BadRequestError(
			`Maximum of ${LIMITS.MAX_PROJECTS_PER_TEAM} per team.`
		);

	const body: ProjectInput = req.body;

	if (!body.title || body.title.trim() === "") {
		throw new BadRequestError("Title is required");
	}

	if (body.title.length > 50) {
		throw new BadRequestError("Title must be 50 characters or less");
	}

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

router.put("/:id", adminOnly, async (req, res) => {
	const { teamId } = reqUser(req);
	const { id } = req.params as { id: string };

	const body: ProjectInput = req.body;

	if (!body.title || body.title.trim() === "") {
		throw new BadRequestError("Title is required");
	}

	if (body.title.length > 50) {
		throw new BadRequestError("Title must be 50 characters or less");
	}

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

router.delete("/:id", adminOnly, async (req, res) => {
	const { teamId } = reqUser(req);

	const { id } = req.params as { id: string };

	await prisma.project.deleteMany({
		where: { id, teamId },
	});

	res.status(204).send();
});

export default router;
