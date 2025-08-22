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
}
