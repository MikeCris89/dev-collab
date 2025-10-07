import { Project, ProjectWithUsers } from "./project.js";
import { Roles, User } from "./user.js";

export type Team = {
	id: string;
	createdAt: string;
};

export type TeamMember = {
	id: string;
	username: string;
	name: string | null;
	role: Roles;
	createdAt: string;
};

export type TeamWithUsers = Team & {
	users: TeamMember[];
};

export type TeamWithProjects = Team & {
	projects: Project[];
};

export type TeamWithAll = Team & {
	users: TeamMember[];
	projects: ProjectWithUsers[];
};
