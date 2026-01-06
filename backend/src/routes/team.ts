import bcrypt from "bcrypt";
import {
	EditUser,
	LIMITS,
	ROLES,
	SignupRequest,
	TeamWithAll,
} from "@shared/contract";
import express from "express";
import { adminOnly } from "src/lib/middleware.js";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "src/lib/errors.js";
import { userQueries } from "src/db/queries/users.js";
import { sanitizeTeamUser } from "src/lib/utils.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const { isAdmin, teamId, sub: userId } = reqUser(req);

	const resp = await prisma.team.findUnique({
		where: { id: teamId },
		include: {
			users: {
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
					createdAt: true,
					projectsUsers: isAdmin
						? {
								select: {
									projectId: true,
									createdAt: true,
								},
						  }
						: false,
				},
			},
			projects: {
				where: isAdmin
					? {}
					: {
							projectsUsers: { some: { userId } },
					  },
				include: {
					projectsUsers: { select: { userId: true, createdAt: true } },
					_count: { select: { folders: true } },
				},
			},
		},
	});

	if (!resp) throw new NotFoundError();

	const team: TeamWithAll = {
		...resp,
		createdAt: resp.createdAt.toISOString(),
		projects: resp.projects.map((p) => ({
			...p,
			createdAt: p.createdAt.toISOString(),
			projectsUsers: p.projectsUsers.map((u) => u.userId),
			childCount: p._count.folders,
		})),
		users: resp.users.map((u) => ({
			...u,
			createdAt: u.createdAt.toISOString(),
			...(isAdmin
				? { projectsUsers: u.projectsUsers.map((p) => p.projectId) }
				: {}),
		})),
	};

	res.json(team);
});

router.post("/", adminOnly, async (req, res) => {
	const { teamId } = reqUser(req);

	const userCount = await prisma.user.count({
		where: { teamId },
	});

	if (userCount >= LIMITS.MAX_USERS_PER_TEAM)
		throw new BadRequestError("Max Users reached");

	const { username, password, name, projectIds } = req.body as SignupRequest;

	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	const existing = await userQueries.getByUsername(username);

	if (existing) throw new BadRequestError("Username taken");

	const hash = await bcrypt.hash(password, 10);

	const user = {
		username,
		password: hash,
		name: name ?? null,
		role: ROLES.team,
		teamId,
	};

	// validate projects belong to team id
	if (projectIds?.length) {
		const validProjects = await prisma.project.count({
			where: {
				id: { in: projectIds },
				teamId: teamId,
			},
		});

		if (validProjects !== projectIds.length) {
			throw new BadRequestError("Some projects not found or not in team");
		}
	}

	const resp = await prisma.user.create({
		data: {
			...user,
			projectsUsers: projectIds?.length
				? {
						createMany: {
							data: projectIds.map((projectId) => ({ projectId })),
						},
				  }
				: {},
		},
	});

	const userData = sanitizeTeamUser(resp);

	res.status(201).json(userData);
});

router.put("/:id", async (req, res) => {
	const { isAdmin, teamId, sub } = reqUser(req);
	const { id } = req.params;

	const { projectIds, ...body }: EditUser = req.body;

	if (!isAdmin) {
		if (sub !== id) throw new UnauthorizedError();
	}

	// validate projects belong to team id
	if (projectIds?.length) {
		const validProjects = await prisma.project.count({
			where: {
				id: { in: projectIds },
				teamId: teamId,
			},
		});

		if (validProjects !== projectIds.length) {
			throw new BadRequestError("Some projects not found or not in team");
		}
	}

	const user = await prisma.user.update({
		where: { id, teamId },
		data: {
			...body,
			projectsUsers: projectIds
				? {
						deleteMany: {},
						createMany: {
							data: projectIds.map((projectId) => ({ projectId })),
						},
				  }
				: {},
		},
	});

	const userData = sanitizeTeamUser(user);

	res.json(userData);
});

export default router;
