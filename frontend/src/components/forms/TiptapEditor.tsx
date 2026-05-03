import { EditorContent, Editor } from "@tiptap/react";
import { LIMITS } from "@shared/contract";
import {
	Bold,
	Italic,
	Strikethrough,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	ListChecks,
	Code2,
	Quote,
} from "lucide-react";

interface TiptapEditorProps {
	placeholder?: string;
	id: string;
	editor: Editor;
}

export function TiptapEditor({ placeholder, id, editor }: TiptapEditorProps) {
	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-col overflow-hidden bg-bg-elevated h-full w-full">
			{/* Toolbar */}
			<div
				className="flex items-center gap-0.5 px-2 py-1.5 bg-bg-muted border-y border-border-light overflow-x-auto"
				tabIndex={-1}
			>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
					title="Bold"
				>
					<Bold size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
					title="Italic"
				>
					<Italic size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
					title="Strikethrough"
				>
					<Strikethrough size={16} />
				</ToolbarButton>

				<Separator />

				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
					title="Heading 1"
				>
					<Heading1 size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
					title="Heading 2"
				>
					<Heading2 size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					isActive={editor.isActive("heading", { level: 3 })}
					title="Heading 3"
				>
					<Heading3 size={16} />
				</ToolbarButton>

				<Separator />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive("bulletList")}
					title="Bullet List"
				>
					<List size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive("orderedList")}
					title="Numbered List"
				>
					<ListOrdered size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					isActive={editor.isActive("taskList")}
					title="Task List"
				>
					<ListChecks size={16} />
				</ToolbarButton>

				<Separator />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive("codeBlock")}
					title="Code Block"
				>
					<Code2 size={16} />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
					title="Quote"
				>
					<Quote size={16} />
				</ToolbarButton>
			</div>
			<p className="text-xs bg-yellow-500/30 py-1">
				⚠️ Portfolio Demo: Do not store any personal or sensitive info.
			</p>

			{/* Editor */}
			<div className="flex-1 flex overflow-hidden h-full">
				<EditorContent
					editor={editor}
					placeholder={placeholder}
					maxLength={LIMITS.NOTE_BODY_MAX_LENGTH}
					className="flex-1 text-left min-h-0 overflow-y-auto overflow-x-hidden [&_.tiptap]:pb-16"
				/>
			</div>
		</div>
	);
}

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
			tabIndex={-1}
			className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0
				${
					isActive
						? "bg-accent-hover text-accent"
						: "text-text-muted hover:text-text-primary hover:bg-hover-light"
				}`}
		>
			{children}
		</button>
	);
}

function Separator() {
	return <div className="w-px h-5 bg-border-medium mx-1 shrink-0" />;
}
