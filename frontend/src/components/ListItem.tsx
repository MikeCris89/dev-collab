import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ListItem = ({
	title,
	createdAt,
	body,
	childCount,
	selected = false,
	onClick,
	icon,
	href,
	page,
}: {
	title: string;
	createdAt: string;
	body?: string;
	childCount: number | null;
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
	const isFolder = page === "f";
	const isProject = page === "p";

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
			{!isNote && childCount != null && (
				<div>
					<small>
						{childCount}{" "}
						{page === "p"
							? `folder${childCount === 1 ? "" : "s"}`
							: `note${childCount === 1 ? "" : "s"}`}
					</small>
				</div>
			)}
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
