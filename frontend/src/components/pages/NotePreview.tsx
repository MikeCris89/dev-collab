import { useNavigate, useParams } from "react-router-dom";
import { useNote } from "@/hooks/useProjects";
import Loading from "../Loading";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";

const NotePreview = () => {
	const { projectId, folderId, noteId } = useParams();
	const navigate = useNavigate();

	const { data: note, isLoading, error } = useNote(projectId, folderId, noteId);

	const editor = useEditor({
		extensions: [
			StarterKit,
			TaskList,
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: "task-item",
				},
			}),
		],
		content: "",
		editable: false,
		editorProps: {
			attributes: {
				class: "focus:outline-none p-4 text-text-primary",
			},
		},
	});

	useEffect(() => {
		if (editor && note?.body) {
			editor.commands.setContent(note.body);
		}
	}, [editor, note?.body]);

	if (error) throw new Error(`Error getting noteId: ${noteId}`);

	if (isLoading) return <Loading />;

	if (!note) throw new Error("Note not found");

	if (!editor) return null;

	return (
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full border-r border-r-border-medium overflow-hidden">
			<div className="flex-1 flex flex-col gap-5 justify-start items-center w-full p-3 overflow-y-auto">
				<div className="flex flex-col  w-full ">
					<div
						className="text-[12px] cursor-pointer hover:text-accent transition-none p-1 text-right text-nowrap self-end "
						onClick={() => navigate("/")}
					>
						x close
					</div>
					<h1 className="flex-1 text-center ">{note.title}</h1>
				</div>
				<div className="w-full">
					<EditorContent editor={editor} className="text-left text-balance" />
				</div>
			</div>
		</section>
	);
};

export default NotePreview;
