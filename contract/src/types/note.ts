import { Folder } from "./folder.js";
import { Project } from "./project.js";
import { User } from "./user.js";

export type Note = {
	id: string;
	title: string;
	body: string;
	userId: string | null;
	projectId: string;
	folderId: string;
	createdAt: string;
	updatedAt: string;
};

export type NoteInput = {
	title: string;
	body: string;
	folderId: string;
};

export type NoteCreate = {
	title: string;
	body: string;
	userId: string | null;
	projectId: string;
	folderId: string;
};

export type NoteWithUser = Note & {
	user: User | null;
};

export type NoteWithProject = Note & {
	project: Project;
};

export type NoteWithFolder = Note & {
	folder: Folder;
};

export type NoteWithComments = Note & {
	comments: Comment[];
};

export type NoteWithAll = Note & {
	user: User | null;
	project: Project;
	folder: Folder;
	comments: Comment[];
};
