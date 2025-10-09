import clsx from "clsx";
import { ChevronRight, Layers } from "lucide-react";
import Button from "./Button";

const ProjectSelection = ({
	title,
	selected = false,
	onClick,
}: {
	title: string;
	selected?: boolean;
	onClick: () => void;
}) => {
	return (
		<Button
			className={clsx("list-item ", selected && "item-selected ")}
			onClick={onClick}
		>
			<div className="flex items-center gap-2 w-full h-4 p-1">
				<Layers />
				<p>{title}</p>
				<ChevronRight className="self-right" />
			</div>
		</Button>
	);
};

export default ProjectSelection;
