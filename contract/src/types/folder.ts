import { Note } from "./note.js";
import { Project } from "./project.js";

export type Folder = {
	id: string;
	title: string;
	projectId: string;
	createdAt: string;
};

export type FolderInput = {
	title: string;
	projectId: string;
};

export type FolderWithProject = Folder & {
	project: Project;
};

export type FolderWithNotes = Folder & {
	notes: Note[];
};

export type FolderWithAll = Folder & {
	project: Project;
	notes: Note[];
};
