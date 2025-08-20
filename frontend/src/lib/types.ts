export interface NoteInput {
	title: string;
	content: string;
}

export interface Note extends NoteInput {
	id: string;
	createdAt: string;
	updatedAt: string;
}

// export type UpdateNote = Partial<NoteInput>;

// export interface ErrorResponse {
// 	message: string;
// 	error?: string;
// }
