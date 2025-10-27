import { useState } from "react";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { LIMITS, type Note } from "@shared/contract";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "@/hooks/useProjects";
import useGetSearchParams from "@/hooks/useGetSearchParams";

const NoteForm = () => {
	const { projectId, folderId, noteId } = useParams();
	const navigate = useNavigate();
	const [action] = useGetSearchParams(["action"]);
	const isEdit = action === "edit";

	const { data: existing } = useNote(projectId, folderId, noteId);
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

	if (!projectId || !folderId)
		throw new Error(`Missing ID's. PID: ${projectId} FID: ${folderId}`);

	if (isEdit && !existing) throw new Error("Existing note data missing");
	if (!isEdit && existing) throw new Error("Existing note found for new entry");

	// Calculate if dirty based on comparison to original values
	const isDirty = existing
		? title !== existing.title || body !== existing.body
		: title.trim() !== "" || body.trim() !== "";

	// Block navigation for unsaved changes
	const allowNav = useUnsavedChanges(isDirty);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title && body) {
			const newNote = { title, body };
			let resp: Note;
			allowNav();
			if (isEdit && existing) {
				resp = await updateNote({
					noteId: existing.id,
					data: newNote,
					folderId,
					projectId,
				});
			} else {
				resp = await addNote({ data: newNote, folderId, projectId });
			}
			navigate(`/p/${projectId}/f/${folderId}/n/${resp.id}`, { replace: true });
		}
	};

	const isLoading = isAdding || isUpdating;
	const error = errAdding || errUpdating;

	return (
		<form id="note-form" onSubmit={handleSubmit} className="form h-full">
			<input
				value={title}
				placeholder="Title"
				required
				onChange={(e) => setTitle(e.target.value)}
				className="text-[36px] text-accent text-center max-w-[90%]"
				disabled={isLoading}
				maxLength={LIMITS.TITLE_MAX_LENGTH}
			/>
			<textarea
				value={body}
				placeholder="body"
				required
				onChange={(e) => setBody(e.target.value)}
				className="flex-1 h-full w-full max-w-[95%] text-center text-xl text-balance"
				disabled={isLoading}
				maxLength={LIMITS.NOTE_BODY_MAX_LENGTH}
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
