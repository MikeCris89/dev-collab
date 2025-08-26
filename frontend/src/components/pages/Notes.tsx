import NotePreview from "../NotePreview";
import Sidebar from "../Sidebar";

const Notes = () => {
	return (
		<div className="flex justify-between items-center h-full w-full ">
			<Sidebar />
			<NotePreview />
		</div>
	);
};

export default Notes;
