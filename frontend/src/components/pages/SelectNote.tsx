import { Edit3 } from "lucide-react";
import Button from "../Button";
import clsx from "clsx";
import { useNotes } from "../../context/NotesContext";

const SelectNote = () => {
	const { setShowForm, setSelected } = useNotes();
	return (
		<div className="h-full w-full flex flex-col justify-center items-center gap-3">
			<div
				className={clsx(
					"w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl bg-neutral-500"
				)}
			>
				<Edit3 size={32} className="opacity-50" />
			</div>
			<h3 className="text-text-muted">No note selected.</h3>
			<Button
				variant="primary"
				onClick={() => {
					setShowForm({ show: true, note: null });
					setSelected(null);
				}}
				className="w-[150px]"
			>
				New Note
			</Button>
		</div>
	);
};

export default SelectNote;
