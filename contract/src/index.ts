import { Roles } from "./types/user.js";

export * from "./types/user.js";
export * from "./types/team.js";
export * from "./types/project.js";
export * from "./types/folder.js";
export * from "./types/note.js";
export * from "./types/comment.js";

// constants
export * from "./constants/roles.js";

export type ErrorDTO = { message: string; code?: string };

export type JwtUser = { sub: string; role: Roles; teamId: string };

// export interface NoteInput {
// 	title: string;
// 	content: string;
// }

// export interface Note extends NoteInput {
// 	id: string;
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface UserLogin {
// 	username: string;
// 	password: string;
// }

// export interface UserSignup extends UserLogin {
// 	firstName?: string ;
// 	lastName?: string;
// }

// export type User = Omit<UserSignup, "password"> & {
// 	id: string;
// 	role: Roles;
// 	teamId: string;
// };
