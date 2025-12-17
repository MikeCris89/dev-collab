import prisma from "../client.js";
import { ROLES, CreateUserDTO } from "@shared/contract";

export const userQueries = {
	async createUser(data: CreateUserDTO) {
		const { teamId, projectIds, ...userData } = data;
		return await prisma.user.create({
			data: {
				...userData,
				role: data.role || ROLES.team,
				team: teamId ? { connect: { id: teamId } } : { create: {} },
			},
		});
	},

	async getByUsername(username: string) {
		return await prisma.user.findUnique({
			where: { username },
		});
	},
};
