import clsx from "clsx";
import { ChevronRight, Layers } from "lucide-react";

const ProjectSelection = ({
	title,
	selected = false,
}: {
	title: string;
	selected?: boolean;
}) => {
	return (
		<div className={clsx("flex items-center gap-2 w-full h-4 p-1")}>
			<Layers />
			<p>{title}</p>
			<ChevronRight className="self-right" />
		</div>
	);
};

export default ProjectSelection;
