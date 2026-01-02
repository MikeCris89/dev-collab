import { useEffect, useState } from "react";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { FORMS, LIMITS, type Note } from "@shared/contract";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "@/hooks/useProjects";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { TiptapEditor } from "./TiptapEditor";
import { useGlobal } from "@/context/GlobalContext";
import Loading from "../Loading";

const NoteForm = () => {
	const { projectId, folderId, noteId } = useParams();
	const navigate = useNavigate();
	const [action] = useGetSearchParams(["action"]);
	const isEdit = action === "edit";

	const { formDirty, setFormDirty } = useGlobal();
	const { data: existing, isLoading: noteLoading } = useNote(
		projectId,
		folderId,
		noteId
	);

	const initialTitle = existing?.title ?? "";
	const initialBody = existing?.body ?? "";

	const [title, setTitle] = useState<string>(initialTitle);
	const [body, setBody] = useState<string>(initialBody);

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

	// Initialize states
	useEffect(() => {
		if (existing) {
			setTitle(existing.title);
			setBody(existing.body);
		}
	}, [existing, noteId]);

	// Check if dirty based on comparison to original values
	useEffect(() => {
		const isDirty = existing
			? title.trim() !== existing.title.trim() ||
			  body.trim() !== existing.body.trim()
			: title.trim() !== "" || body.trim() !== "";

		setFormDirty(isDirty);
	}, [title, body, setFormDirty, existing]);

	// Block navigation for unsaved changes
	const allowNav = useUnsavedChanges(formDirty);

	if (!projectId || !folderId)
		throw new Error(`Missing ID's. PID: ${projectId} FID: ${folderId}`);

	if (isEdit && noteLoading) {
		return <Loading />;
	}

	if (isEdit && !existing) throw new Error("Existing note data missing");
	if (!isEdit && existing) throw new Error("Existing note found for new entry");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title && body) {
			const newNote = { title, body };
			let resp: Note;
			allowNav();
			if (isEdit && existing) {
				console.log("SAVE BODY", body);
				if (formDirty)
					resp = await updateNote({
						noteId: existing.id,
						data: newNote,
						folderId,
						projectId,
					});
				else resp = existing;
			} else {
				resp = await addNote({ data: newNote, folderId, projectId });
			}
			navigate(
				`/p/${projectId}/f/${folderId}/n/${resp.id}?action=edit&formId=${FORMS.n}`,
				{ replace: true }
			);
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
				autoFocus={!isEdit}
			/>

			<TiptapEditor
				key={existing?.id || "new"}
				content={body}
				onChange={(html) => {
					setBody(html);
				}}
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
