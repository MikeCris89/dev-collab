import { Project } from "./project.js";
import { User } from "./user.js";

export type Team = {
	id: string;
	createdAt: string;
};

export type TeamWithUsers = Team & {
	users: User[];
};

export type TeamWithProjects = Team & {
	projects: Project[];
};

export type TeamWithAll = Team & {
	users: User[];
	projects: Project[];
};
