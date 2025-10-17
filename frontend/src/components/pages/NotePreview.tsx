import { useParams } from "react-router-dom";
import { useGlobal } from "../../context/GlobalContext";
import { useNote } from "@/hooks/useProjects";

const NotePreview = () => {
	const { selected, setSelected, showForm } = useGlobal();
	const { projectId, folderId, noteId } = useParams();

	const { data: note } = useNote(projectId, folderId, noteId);

	if (!note) throw new Error("Note not found");

	console.log(showForm, selected);

	return (
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full border-r border-r-border-medium">
			{!showForm.show && selected && (
				<div className="flex-1 flex flex-col gap-10 justify-start items-center max-w-[90%]">
					<div
						className="text-[16px] self-end cursor-pointer p-2 hover:font-bold transition-none"
						onClick={() => setSelected((prev) => ({ ...prev, n: null }))}
					>
						X
					</div>
					<div className="flex justify-center  h-[20%] w-full">
						<h1 className="m-auto ">{note.title}</h1>
					</div>
					<p className="card w-full max-w-[600px] min-h-[100px] p-6 text-center text-balance whitespace-pre-line">
						{note.body}
					</p>
				</div>
			)}
		</section>
	);
};

export default NotePreview;
