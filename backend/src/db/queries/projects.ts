import prisma from "../client.js";

export const projectQueries = {
	async getProjects(teamId: string) {
		return await prisma.project.findMany({
			where: { teamId },
		});
	},

	async getProject(id: string, teamId: string) {
		return await prisma.project.findUnique({
			where: { teamId, id },
		});
	},
};
