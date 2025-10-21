import { ProjectsUser } from "./projects-user.js";
import { ROLES } from "../constants/roles.js";
import { Team } from "./team.js";

export type Roles = (typeof ROLES)[keyof typeof ROLES];

export type User = {
	id: string;
	username: string;
	name?: string;
	role: Roles;
	teamId: string;
	createdAt: string;
};

export type UserAuth = {
	sub: string;
	isAdmin: boolean;
	teamId: string;
	role: Roles;
};

export type EditUser = {
	name?: string;
	projectIds?: string[];
};

export type UserWithTeam = User & {
	team: Team;
};

export type UserWithProjects = User & {
	projectsUsers?: Omit<ProjectsUser, "userId">[];
};

export type SignupRequest = {
	username: string;
	password: string;
	name?: string;
	teamId?: string;
	projectIds?: string[];
};

export type LoginRequest = {
	username: string;
	password: string;
};

export type JwtUser = { sub: string; role: Roles; teamId: string };
