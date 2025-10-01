import { ProjectsUser } from "./projects-user.js";
import { ROLES } from "../constants/roles.js";
import { Team } from "./team.js";

export type Roles = (typeof ROLES)[keyof typeof ROLES];

export type User = {
	id: string;
	username: string;
	firstName?: string;
	lastName?: string;
	role: Roles;
	teamId: string;
	createdAt: string;
};

export type EditUser = {
	username: string;
	firstName?: string;
	lastName?: string;
};

export type UserWithTeam = User & {
	team: Team;
};

export type UserWithProjects = User & {
	projectsUsers: ProjectsUser[];
};

export type SignupRequest = {
	username: string;
	password: string;
	firstName?: string;
	lastName?: string;
	teamId?: string;
};

export type LoginRequest = {
	username: string;
	password: string;
};
