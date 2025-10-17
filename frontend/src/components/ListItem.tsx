import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";

const ListItem = ({
	title,
	selected = false,
	onClick,
	icon,
	href,
}: {
	title: string;
	selected?: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	href?: string;
}) => {
	const [isSel, setIsSel] = useState(selected);

	useEffect(() => {
		setIsSel(selected);
	}, [selected]);

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
			<div className="flex justify-between items-center gap-2 w-full h-6 ">
				<div className="flex justify-start gap-2 flex-1">
					{icon}
					<p className="text-left line-clamp-1 text-ellipsis flex-1">{title}</p>
				</div>
				<ChevronRight />
			</div>
		</Button>
	);
};

export default ListItem;
