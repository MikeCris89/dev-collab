import { LIMITS, Project } from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import { ProjectInput, ROLES } from "@shared/contract";
import { BadRequestError, NotFoundError } from "src/lib/errors.js";
import { validateProjectInput } from "src/lib/utils.js";

const router = express.Router();

router.get("/:projectId", async (req, res) => {
	const { teamId, role, sub } = reqUser(req);
	const { projectId } = req.params;

	const resp = await prisma.project.findFirst({
		where:
			role === ROLES.admin
				? { id: projectId, teamId }
				: { id: projectId, teamId, projectsUsers: { some: { userId: sub } } },

		select: {
			id: true,
			folders: {
				include: {
					notes: {
						orderBy: { createdAt: "asc" },
					},
					_count: { select: { notes: true } },
				},
				orderBy: { createdAt: "asc" },
			},
			_count: { select: { folders: true } },
		},
	});

	if (!resp) {
		throw new NotFoundError("Project not found");
	}

	const project = {
		...resp,
		folders: resp.folders.map((f) => ({
			...f,
			notes: f.notes.map((n) => ({
				...n,
				childCount: null,
			})),
			childCount: f._count.notes,
		})),
	};

	res.json(project);
});

// Admin Only Actions

router.use(adminOnly);

router.delete("/:projectId", async (req, res) => {
	const { teamId } = reqUser(req);
	const { projectId } = req.params;

	await prisma.project.delete({
		where: { id: projectId, teamId },
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

router.put("/:projectId", async (req, res) => {
	const { teamId } = reqUser(req);
	const { projectId } = req.params;

	const body: ProjectInput = req.body;

	const resp = await prisma.project.update({
		where: { id: projectId, teamId },
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
