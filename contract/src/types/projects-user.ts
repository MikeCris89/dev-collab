import { Project } from "./project.js";
import { User } from "./user.js";
export type ProjectsUser = {
	userId: string;
	projectId: string;
	createdAt: string;
};

export type ProjectsUserWithUser = ProjectsUser & {
	user: User;
};

export type ProjectsUserWithProject = ProjectsUser & {
	project: Project;
};

export type ProjectsUserWithAll = ProjectsUser & {
	user: User;
	project: Project;
};
