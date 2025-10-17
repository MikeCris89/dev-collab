import { useState } from "react";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import type { Note } from "@shared/contract";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { useNavigate, useParams } from "react-router-dom";

const NoteForm = ({ existing }: { existing?: Note }) => {
	const { projectId, folderId } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState<string>(existing?.title ?? "");
	const [body, setBody] = useState<string>(existing?.body ?? "");

	const {
		mutateAsync: addNote,
		isPending: isAdding,
		error: errAdding,
	} = useCreateNote();

	const {
		mutateAsync: updateNote,
		isPending: isUpdating,
		error: errUpdating,
	} = useUpdateNote();

	if (!projectId || !folderId) throw new Error("Something went wrong.");

	// Calculate if dirty based on comparison to original values
	const isDirty = !existing
		? title.trim() !== "" || body.trim() !== ""
		: title !== existing.title || body !== existing.body;

	// Block navigation for unsaved changes
	useUnsavedChanges(isDirty);

	const handleSubmit = async (e: React.FormEvent) => {
		console.log("saving form");
		e.preventDefault();
		if (title && body) {
			const newNote = { title, body };
			let resp: Note;
			if (existing?.id) {
				resp = await updateNote({ id: existing.id, data: newNote, folderId });
			} else {
				resp = await addNote({ data: newNote, folderId, projectId });
			}
			navigate(`/p/${projectId}/f/${folderId}/n/${resp.id}`, { replace: true });
		}
	};

	const isLoading = isAdding || isUpdating;
	const error = errAdding || errUpdating;

	return (
		<form id="note-form" onSubmit={handleSubmit} className="form">
			<input
				value={title}
				placeholder="Title"
				required
				onChange={(e) => setTitle(e.target.value)}
				className="text-[36px] text-accent text-center max-w-[95%]"
				disabled={isLoading}
			/>
			<textarea
				value={body}
				placeholder="body"
				required
				onChange={(e) => setBody(e.target.value)}
				className="h-[50%] w-full max-w-[90%] text-center text-balance"
				disabled={isLoading}
			/>
			{error && (
				<p className="text-red-500">
					{error.message || "Something went wrong"}
				</p>
			)}
		</form>
	);
};

export default NoteForm;
