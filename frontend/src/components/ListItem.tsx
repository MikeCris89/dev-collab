import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

const ListItem = ({
	title,
	createdAt,
	body,
	selected = false,
	onClick,
	icon,
	href,
	page,
}: {
	title: string;
	createdAt: string;
	body?: string;
	selected?: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	href?: string;
	page: string;
}) => {
	const [isSel, setIsSel] = useState(selected);
	const { noteId } = useParams();

	useEffect(() => {
		setIsSel(selected);
	}, [selected]);

	const isNote = page === "n";

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
		content: body || "",
		editable: false,
		editorProps: {
			attributes: {
				class:
					"focus:outline-none !text-xs prose-p:!text-xs prose-li:!text-xs prose-ul:!my-1 prose-li:!my-0",
			},
			// attributes: {
			// 	class: "focus:outline-none text-text-primary !text-xs leading-tight",
			// },
		},
	});

	const extractText = (html: string) => {
		const div = document.createElement("div");
		div.innerHTML = html;
		return div.textContent || "";
	};

	return (
		<Button
			className={clsx(
				"list-item",
				(selected || isSel) && "item-selected flex-nowrap"
			)}
			onClick={() => {
				if (!noteId) setIsSel(true);
				onClick();
			}}
			href={href}
		>
			<div className={clsx("flex justify-start items-center gap-2 w-full ")}>
				<div className="flex-1 flex justify-start items-center gap-2">
					<i className="shrink-0">{icon}</i>
					<p
						className={clsx(
							" text-left line-clamp-2 text-ellipsis text-base text-balance",
							isNote && ""
						)}
					>
						{title}
					</p>
				</div>
				<i className="shrink-0">{!isNote && <ChevronRight />}</i>
			</div>
			{isNote && (
				<>
					{body && (
						<div
							className="preview-content line-clamp-3 text-left text-balance"
							dangerouslySetInnerHTML={{ __html: body }}
						/>
					)}
					<small className="float-left">
						{new Date(createdAt).toLocaleDateString()}
					</small>
				</>
			)}
		</Button>
	);
};

export default ListItem;
