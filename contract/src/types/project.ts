import { Folder, FolderWithNotes } from "./folder.js";
import { Note } from "./note.js";
import { ProjectsUser } from "./projects-user.js";

export type Project = {
	id: string;
	title: string;
	teamId: string;
	createdAt: string;
};

export type ProjectInput = {
	title: string;
	userIds?: string[];
};

export type ProjectWithFolders = Project & {
	folders: Folder[];
};

export type ProjectWithNotes = Project & {
	notes: Note[];
};

export type ProjectWithUsers = Project & {
	projectsUsers: string[];
};

export type ProjectWithAll = Project & {
	folders: FolderWithNotes[];
};
