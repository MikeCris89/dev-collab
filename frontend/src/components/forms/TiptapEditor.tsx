import { EditorContent, Editor } from "@tiptap/react";

import { LIMITS } from "@shared/contract";
import { useEffect } from "react";

interface TiptapEditorProps {
	placeholder?: string;
	id: string;
	editor: Editor;
}

export function TiptapEditor({ placeholder, id, editor }: TiptapEditorProps) {
	// const editor = useEditor({
	// 	extensions: [
	// 		StarterKit,
	// 		TaskList,
	// 		TaskItem.configure({
	// 			nested: true,
	// 		}),
	// 	],
	// 	content,
	// 	onUpdate: ({ editor }) => {
	// 		onChange(editor.getHTML());
	// 	},
	// 	onTransaction: () => {
	// 		forceUpdate({}); // Force toolbar to re-render on cursor move
	// 	},
	// 	editorProps: {
	// 		attributes: {
	// 			class:
	// 				"prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-4",
	// 		},
	// 	},
	// });

	// Update editor content when prop changes
	// useEffect(() => {
	// 	if (editor && content !== editor.getHTML()) {
	// 		editor.commands.setContent(content);
	// 	}
	// }, [content, editor]);

	if (!editor) {
		return null;
	}

	const oldStyle = "border border-border-medium rounded-lg ";
	const oldToolbar = " rounded-lg ";

	return (
		<div className="flex flex-col overflow-hidden bg-bg-elevated h-full w-full ">
			{/* Toolbar */}
			<div
				className="flex gap-1 p-2 bg-bg-muted border-y border-border-medium flex-wrap overflow-hidden"
				tabIndex={-1}
			>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					title="Bold"
				>
					<strong>B</strong>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					title="Italic"
				>
					<em>I</em>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
					title="Strikethrough"
				>
					<s>S</s>
				</ToolbarButton>

				<div className="w-px bg-border-light mx-1" />

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					title="Heading 1"
				>
					H1
				</ToolbarButton>

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					title="Heading 2"
				>
					H2
				</ToolbarButton>

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					isActive={editor.isActive("heading", { level: 3 })}
					title="Heading 3"
				>
					H3
				</ToolbarButton>

				<div className="w-px bg-border-light mx-1" />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive("bulletList")}
					title="Bullet List"
				>
					• List
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive("orderedList")}
					title="Numbered List"
				>
					1. List
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					isActive={editor.isActive("taskList")}
					title="Task List"
				>
					✓ Tasks
				</ToolbarButton>

				<div className="w-px bg-border-light mx-1" />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive("codeBlock")}
					title="Code Block"
				>
					{"</>"}
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
					title="Quote"
				>
					" "
				</ToolbarButton>
			</div>

			{/* Editor */}
			<div className="flex-1 flex overflow-hidden h-full ">
				<EditorContent
					// key={id}
					editor={editor}
					placeholder={placeholder}
					maxLength={LIMITS.NOTE_BODY_MAX_LENGTH}
					className="flex-1 text-left min-h-0 overflow-y-auto overflow-x-hidden [&_div]:h-full"
				/>
			</div>
		</div>
	);
}

// Toolbar Button Component
interface ToolbarButtonProps {
	onClick: () => void;
	isActive: boolean;
	children: React.ReactNode;
	title?: string;
}

function ToolbarButton({
	onClick,
	isActive,
	children,
	title,
}: ToolbarButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
        ${
					isActive
						? "bg-accent-hover text-accent"
						: "bg-bg-elevated hover:bg-hover-medium text-text-primary border border-border-medium"
				}`}
			tabIndex={-1}
		>
			{children}
		</button>
	);
}
