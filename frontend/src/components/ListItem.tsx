import clsx from "clsx";
import { ChevronRight, Layers } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { useParams } from "react-router-dom";

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

	return (
		<Button
			className={clsx("list-item", (selected || isSel) && "item-selected ")}
			onClick={() => {
				setIsSel(true);
				onClick();
			}}
			href={href}
		>
			<div className="flex justify-between items-center gap-2 w-full h-6 p-2">
				<div className="flex gap-2">
					{icon}
					<p>{title}</p>
				</div>
				<ChevronRight />
			</div>
		</Button>
	);
};

export default ListItem;
