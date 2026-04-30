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
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

const NoteForm = () => {
	const { projectId, folderId, noteId } = useParams();
	const navigate = useNavigate();
	const [action] = useGetSearchParams(["action"]);
	const isEdit = action === "edit";

	const { formDirty, setFormDirty } = useGlobal();
	const { data: existing, isLoading: noteLoading } = useNote(
		projectId,
		folderId,
		noteId,
	);

	const initialTitle = existing?.title ?? "";
	// const initialBody = existing?.body ?? "";

	const [title, setTitle] = useState<string>(initialTitle);
	// const [body, setBody] = useState<string>(initialBody);
	const [, forceUpdate] = useState({}); // Trick to force re-render

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

	const checkIsDirty = (body: string) => {
		const isDirty = existing
			? title.trim() !== existing.title.trim() ||
				body.trim() !== existing.body.trim()
			: title.trim() !== "" || body.trim() !== "";
		setFormDirty(isDirty);
	};

	const editor = useEditor(
		{
			extensions: [
				StarterKit,
				TaskList,
				TaskItem.configure({
					nested: true,
				}),
			],
			content: existing?.body ?? "",
			onUpdate: ({ editor }) => {
				checkIsDirty(editor.getHTML());
			},
			onTransaction: () => {
				forceUpdate({}); // Force toolbar to re-render on cursor move
			},
			editorProps: {
				attributes: {
					class:
						"prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4",
				},
			},
		},
		[noteId],
	);

	// Initialize states
	useEffect(() => {
		if (existing) {
			setTitle(existing.title);
			setFormDirty(false);

			// Update editor content without adding to history
			if (editor) {
				editor.commands.setContent(existing.body, {
					emitUpdate: false,
				});
			}
		} else {
			setTitle("");
			setFormDirty(false);

			// Clear editor when creating new note
			if (editor) {
				editor.commands.setContent("", {
					emitUpdate: false,
				});
			}
		}
	}, [existing, noteId, setFormDirty, editor]);

	// Check if dirty based on comparison to original values
	useEffect(() => {
		if (!editor) return;

		checkIsDirty(editor.getHTML());
	}, [title, existing, editor]);

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
		if (!editor) return;
		const body = editor.getHTML();
		if (title && body) {
			const newNote = { title, body };
			let resp: Note;
			allowNav();
			if (isEdit && existing) {
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
				{ replace: true },
			);
		}
	};

	const isLoading = isAdding || isUpdating;
	const error = errAdding || errUpdating;

	const formatDate = (iso: string) => {
		const d = new Date(iso);
		const now = new Date();
		return d.toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
			hour: "numeric",
			minute: "2-digit",
		});
	};

	return (
		<form
			id="note-form"
			onSubmit={handleSubmit}
			className="form h-full p-0 gap-0"
		>
			<div className="w-full px-2 md:px-3 pt-3 pb-2 border-b border-border-light">
				<input
					value={title}
					placeholder="title"
					required
					onChange={(e) => setTitle(e.target.value)}
					className="text-[30px] md:text-[36px] text-accent text-left w-full p-0 m-0 pt-1 pb-2 border-none outline-none h-fit bg-transparent"
					disabled={isLoading}
					maxLength={LIMITS.TITLE_MAX_LENGTH}
					autoFocus={!isEdit}
				/>
				{isEdit && existing && (
					<div className="flex items-center gap-1.5 text-[11px] text-text-muted leading-none pb-1">
						<span>Created {formatDate(existing.createdAt)}</span>
						<span className="text-accent/40">·</span>
						<span>Updated {formatDate(existing.updatedAt)}</span>
					</div>
				)}
			</div>

			<TiptapEditor
				// key={existing?.id || "new"}
				id={existing?.id || "new"}
				editor={editor}
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
