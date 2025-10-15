import { useState } from "react";
import { useGlobal } from "../../context/GlobalContext";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import type { Note } from "@shared/contract";

const NoteForm = ({ existing }: { existing?: Note }) => {

	const [title, setTitle] = useState<string>(existing?.title ?? "");
	const [body, setBody] = useState<string>(existing?.body ?? "");

	// Calculate if dirty based on comparison to original values
	const isDirty = !existing
		? title.trim() !== "" || body.trim() !== ""
		: title !== existing.title || body !== existing.body;

	// Block navigation for unsaved changes
	useUnsavedChanges(isDirty);

	const handleSubmit = (e: React.FormEvent) => {
		console.log("saving form");
		e.preventDefault();
		if (title && body) {
			const newNote = { title, body };
			// if (existing?.id) {
			// 	updateNote(existing.id, newNote);
			// } else {
			// 	addNote(newNote);
			// }
		}
	};

	return (
		<form id="note-form" onSubmit={handleSubmit} className="form">
			<input
				value={title}
				placeholder="Title"
				required
				onChange={(e) => setTitle(e.target.value)}
				className="text-[36px] text-accent text-center max-w-[95%]"
				// disabled={isLoading}
			/>
			<textarea
				value={body}
				placeholder="body"
				required
				onChange={(e) => setBody(e.target.value)}
				className="h-[50%] w-full max-w-[90%] text-center text-balance"
				// disabled={isLoading}
			/>
		
		</form>
	);
};

export default NoteForm;
