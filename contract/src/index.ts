export const ROLES = {
	admin: "ADMIN",
	team: "TEAM",
} as const;

export type Roles = (typeof ROLES)[keyof typeof ROLES];

export interface NoteInput {
	title: string;
	content: string;
}

export interface Note extends NoteInput {
	id: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: string;
	username: string;
	role: Roles;
	firstName: string | null;
	lastName: string | null;
	teamId: string;
}

export type JwtUser = { sub: string; role: Roles; teamId: string };
