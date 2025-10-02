import { Folder } from "./folder.js";
import { Note } from "./note.js";
import { ProjectsUser } from "./projects-user.js";
import { Team } from "./team.js";

export type Project = {
	id: string;
	title: string;
	teamId: string;
	createdAt: string;
};

export type ProjectInput = {
	title: string;
};

export type ProjectWithFolders = Project & {
	folders: Folder[];
};

export type ProjectWithNotes = Project & {
	notes: Note[];
};

export type ProjectWithUsers = Project & {
	projectsUsers: ProjectsUser[];
};

export type ProjectWithAll = Project & {
	folders: Folder[];
	notes: Note[];
	projectsUsers: ProjectsUser[];
};
