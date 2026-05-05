import Button from "../Button";
import clsx from "clsx";
import { useGlobal } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Edit3, FolderEditIcon, Layers2 } from "lucide-react";
import useRequireAuth from "@/hooks/useRequireAuth";

const info = {
	p: { label: "Project", icon: <Layers2 size={38} opacity={0.5} /> },
	f: { label: "Folder", icon: <FolderEditIcon size={38} opacity={0.5} /> },
	n: { label: "Note", icon: <Edit3 size={38} opacity={0.5} /> },
};

const NoneSelected = () => {
	const { setShowMenu, selected, nav } = useGlobal();
	const { isAdmin } = useRequireAuth();
	const navigate = useNavigate();

	const page = selected.page;

	return (
		<>
			<div className="h-full w-full flex flex-col justify-center items-center gap-3">
				<div
					className={clsx(
						"w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl bg-neutral-500",
					)}
				>
					{info[page].icon}
				</div>
				<h3 className="text-text-muted text-4xl">
					No {info[page].label} selected
				</h3>
				<p className="text-text-muted">
					Select from the menu {(isAdmin || page === "n") && "or Create New:"}
				</p>
				{(isAdmin || page === "n") && (
					<Button
						variant="primary"
						onClick={() => {
							setShowMenu(false);
							navigate(
								`${nav[page].formUrl}?action=add&formId=${nav[page].formId}`,
							);
						}}
						className="w-[150px]"
					>
						New {info[page].label}
					</Button>
				)}
			</div>
		</>
	);
};

export default NoneSelected;
