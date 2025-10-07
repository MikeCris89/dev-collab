import bcrypt from "bcrypt";
import { EditUser, ROLES } from "@shared/contract";
import express from "express";
import { adminOnly, requireAuth } from "src/lib/middleware.js";
import { reqUser } from "src/types/types.js";
import prisma from "../db/client.js";
import { BadRequestError, UnauthorizedError } from "src/lib/errors.js";
import { userQueries } from "src/db/queries/users.js";
import { sanitizeTeamUser } from "src/lib/utils.js";

const router = express.Router();

router.use(requireAuth);

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
					projectsUsers: {
						select: {
							projectId: true,
							createdAt: true,
						},
					},
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
				},
			},
		},
	});

	res.json(resp);
});

router.post("/", adminOnly, async (req, res) => {
	const { teamId } = reqUser(req);

	const { username, password, name } = req.body;

	if (!username || !password)
		throw new BadRequestError("Username and Password required");

	const existing = await userQueries.getByUsername(username);

	if (existing) throw new BadRequestError("Username taken");

	const hash = await bcrypt.hash(password, 10);

	const user = await userQueries.createUser({
		username,
		password: hash,
		name,
		role: ROLES.team,
		teamId,
	});

	const userData = sanitizeTeamUser(user);

	res.status(201).json(userData);
});

router.put("/:id", async (req, res) => {
	const { isAdmin, teamId, sub } = reqUser(req);
	const { id } = req.params;

	const body: EditUser = req.body;

	if (!isAdmin) {
		if (sub !== id) throw new UnauthorizedError();
	}

	const user = await prisma.user.update({
		where: { id, teamId },
		data: body,
	});

	const userData = sanitizeTeamUser(user);

	res.json(userData);
});
