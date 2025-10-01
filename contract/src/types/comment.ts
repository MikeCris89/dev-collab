import { Note } from "./note.js";
import { User } from "./user.js";

export type Comment = {
	id: string;
	body: string;
	userId: string | null;
	noteId: string;
	createdAt: string;
	updatedAt: string;
};

export type CommentWithUser = Comment & {
	user: User | null;
};

export type CommentWithNote = Comment & {
	note: Note;
};

export type CommentWithAll = Comment & {
	user: User | null;
	note: Note;
};
