import { useNotes } from "../../context/NotesContext";
import NoteForm from "../NoteForm";

const NotePreview = () => {
	const { selected, error, showForm, setSelected } = useNotes();

	if (error)
		return (
			<div className="flex-1  text-red-500">
				<h3 className="m-auto">Error: {error}</h3>
			</div>
		);

	return (
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full border-r border-r-border-medium">
			{showForm.show && <NoteForm existing={showForm.note ?? undefined} />}

			{!showForm.show && selected && (
				<div className="flex-1 flex flex-col gap-10 justify-start items-center max-w-[90%]">
					<div
						className="text-[16px] self-end cursor-pointer p-2 hover:font-bold transition-none"
						onClick={() => setSelected(null)}
					>
						X
					</div>
					<div className="flex justify-center  h-[20%] w-full">
						<h1 className="m-auto ">{selected.title}</h1>
					</div>
					<p className="card w-full max-w-[600px] min-h-[100px] p-6 text-center text-balance whitespace-pre-line">
						{selected.content}
					</p>
				</div>
			)}
		</section>
	);
};

export default NotePreview;
