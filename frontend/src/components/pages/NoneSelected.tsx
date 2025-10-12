import Button from "../Button";
import clsx from "clsx";
import { useGlobal } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Edit3, FolderEditIcon, Layers2 } from "lucide-react";

const nav = {
	p: { label: "Project", icon: <Layers2 size={32} opacity={0.5} /> },
	f: { label: "Folder", icon: <FolderEditIcon size={32} opacity={0.5} /> },
	n: { label: "Note", icon: <Edit3 size={32} opacity={0.5} /> },
};

const NoneSelected = () => {
	const { setShowMenu, selected, setShowForm } = useGlobal();
	const navigate = useNavigate();
	const page = selected.page;

	console.log(page);

	return (
		<div className="h-full w-full flex flex-col justify-center items-center gap-3">
			<div
				className={clsx(
					"w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl bg-neutral-500"
				)}
			>
				{/* <Edit3 size={32} className="opacity-50" /> */}
				{nav[page].icon}
			</div>
			<h3 className="text-text-muted text-4xl">
				No {nav[page].label} selected
			</h3>
			<p className="text-text-muted">Select one from the list or Create New:</p>
			<Button
				variant="primary"
				onClick={() => {
					setShowForm((prev) => ({ ...prev, form: nav[page].newFormId }));
					setShowMenu(false);
					navigate(nav[page].newFormUrl);
				}}
				className="w-[150px]"
			>
				New {nav[page].label}
			</Button>
		</div>
	);
};

export default NoneSelected;
