import { useNotes } from "../context/NotesContext";
import Button from "./Button";
import NoteForm from "./NoteForm";

const NotePreview = () => {
	const { selected, error, showForm, setShowForm, setSelected } = useNotes();

	if (error)
		return (
			<div className="flex-1  text-red-500">
				<h3 className="m-auto">Error: {error}</h3>
			</div>
		);

	// if (showForm.show === true) {
	// 	return;
	// }

	// if (!selected && showForm.show === false)
	// 	return (
	// 		<div className="flex-1">
	// 			<h3 className="text-text-muted m-auto">No note selected...</h3>
	// 		</div>
	// 	);

	return (
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full">
			<div className="flex justify-between items-center p-2 w-full bg-bg-elevated border-b border-b-border-light h-24">
				{
					<>
						<div className="text-left">
							<small className="font-bold">
								created:{" "}
								{selected
									? new Date(selected.createdAt).toLocaleString()
									: " - "}
							</small>
							<br />
							<small>
								last updated:{" "}
								{selected
									? new Date(selected.updatedAt).toLocaleString()
									: " - "}
							</small>
						</div>
						<div className="flex flex-wrap justify-end gap-3">
							{!showForm.show && (
								<>
									<Button
										onClick={() => setShowForm({ show: true, note: selected })}
									>
										✏️ edit
									</Button>
									<Button>🗑️ delete</Button>
								</>
							)}
							{showForm.show && (
								<>
									<Button
										onClick={() => setShowForm({ show: false, note: null })}
									>
										❌ cancel
									</Button>
									<Button type="submit" form="note-form" variant="primary">
										save
									</Button>
								</>
							)}
						</div>
					</>
				}
			</div>

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
					<p className="card w-[600px] min-h-[100px] p-6">{selected.content}</p>
				</div>
			)}

			{!showForm.show && !selected && (
				<h3 className="text-text-muted m-auto">No note selected...</h3>
			)}
		</section>
	);
};

export default NotePreview;
