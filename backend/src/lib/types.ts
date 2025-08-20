export interface NoteInput {
	title: string;
	content: string;
}

export type Note = NoteInput & {
	id: string;
	createdAt: string;
	updatedAt: string;
};

export type UpdateNote = Partial<NoteInput>;

export interface ErrorResponse {
	message: string;
	error?: string;
}
