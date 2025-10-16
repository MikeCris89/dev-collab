import { Folder } from "./folder.js";
import { Project } from "./project.js";
import { User } from "./user.js";

export type Note = {
	id: string;
	title: string;
	body: string;
	userId: string | null;
	folderId: string;
	createdAt: string;
	updatedAt: string;
};

export type NoteInput = {
	title: string;
	body: string;
};

export type NoteCreate = NoteInput & {
	userId: string | null;
};

export type NoteWithUser = Note & {
	user: User | null;
};

export type NoteWithFolder = Note & {
	folder: Folder;
};

export type NoteWithComments = Note & {
	comments: Comment[];
};

export type NoteWithAll = Note & {
	user: User | null;
	folder: Folder;
	comments: Comment[];
};
