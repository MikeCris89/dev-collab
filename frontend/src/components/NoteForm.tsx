import { useState } from "react";
import type { Note } from "../lib/types";
import { useNotes } from "../context/NotesContext";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";

const NoteForm = ({ existing }: { existing?: Note }) => {
	const { addNote, updateNote, isLoading } = useNotes();

	console.log(existing);

	const [title, setTitle] = useState<string>(existing?.title ?? "");
	const [content, setContent] = useState<string>(existing?.content ?? "");

	// Calculate if dirty based on comparison to original values
	const isDirty = !existing
		? title.trim() !== "" || content.trim() !== ""
		: title !== existing.title || content !== existing.content;

	// Block navigation for unsaved changes
	useUnsavedChanges(isDirty);

	const handleSubmit = (e: React.FormEvent) => {
		console.log("saving form");
		e.preventDefault();
		if (title && content) {
			const newNote = { title, content };
			if (existing?.id) {
				updateNote(existing.id, newNote);
			} else {
				addNote(newNote);
			}
		}
	};

	return (
		<form
			id="note-form"
			onSubmit={handleSubmit}
			className="flex-1 flex flex-col gap-10 justify-center items-center h-full w-full "
		>
			<input
				value={title}
				placeholder="Title"
				required
				onChange={(e) => setTitle(e.target.value)}
				className="text-[36px] text-accent text-center max-w-[95%]"
				disabled={isLoading}
			/>
			<textarea
				value={content}
				placeholder="content"
				required
				onChange={(e) => setContent(e.target.value)}
				className="h-[50%] w-full max-w-[90%] text-center text-balance"
				disabled={isLoading}
			/>
			{/* <div>
				<button
					type="button"
					onClick={() => setShowForm({ show: false, note: null })}
					disabled={isLoading}
				>
					cancel
				</button>
				<button type="submit" disabled={isLoading}>
					submit
				</button>
			</div> */}
		</form>
	);
};

export default NoteForm;
