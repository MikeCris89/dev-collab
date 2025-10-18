import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		setIsSel(selected);
	}, [selected]);

	const isNote = page === "n";

	return (
		<Button
			className={clsx(
				"list-item",
				(selected || isSel) && "item-selected flex-nowrap"
			)}
			onClick={() => {
				setIsSel(true);
				onClick();
			}}
			href={href}
		>
			<div
				className={clsx(
					"flex justify-between items-center gap-2 w-full h-6 ",
					isNote && "h-14"
				)}
			>
				<div className="flex justify-start items-center gap-2 flex-1">
					{icon}
					{/* // <div className="">
						// 	<h3 className={clsx("text-2xl")}>{title}</h3>
						// 	<small>{new Date(createdAt).toLocaleDateString()}</small>
						// </div> */}

					<p
						className={clsx(
							"text-left line-clamp-1 text-ellipsis flex-1",
							isNote && "text-3xl"
						)}
					>
						{title}
					</p>
				</div>
				{!isNote && <ChevronRight />}
			</div>
			{isNote && (
				<>
					{body && <small className="line-clamp-2 text-left">{body}</small>}
					<small className="float-left">
						{new Date(createdAt).toLocaleDateString()}
					</small>
				</>
			)}
		</Button>
	);
};

export default ListItem;
