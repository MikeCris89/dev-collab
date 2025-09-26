import { Prisma } from "@prisma/client";
import prisma from "../client.js";
import { ROLES } from "@you/contract";

export type CreateUserDTO = Omit<Prisma.UserCreateInput, "team"> & {
	teamId?: string;
};

export const userQueries = {
	async createUser(data: CreateUserDTO) {
		const { teamId, ...userData } = data;
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
