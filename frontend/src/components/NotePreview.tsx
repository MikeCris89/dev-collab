import clsx from "clsx";
import { useNotes } from "../context/NotesContext";
import Button from "./Button";
import NoteForm from "./NoteForm";
import { Edit3 } from "lucide-react";

const NotePreview = () => {
	const {
		selected,
		error,
		showForm,
		setShowForm,
		setSelected,
		showMenu,
		setShowMenu,
	} = useNotes();

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
		<section className="flex-1 flex flex-col gap-3 justify-start items-center h-full w-full border-r border-r-border-medium">
			<div
				id="note-bar"
				className="flex flex-col-reverse md:flex-row md:justify-between md:items-center w-full bg-bg-elevated border-b border-b-border-light h-fit relative p-1 md:p-3 md:pl-3"
			>
				{
					<>
						{/* <Button
							className={clsx(
								"md:hidden absolute top-[50%] left-0 -translate-y-1/2 rounded-[0_14px_14px_0] !py-2 !px-0 !min-w-[50px]"
							)}
							variant="menu"
						>
							<i className="flex items-center justify-center text-2xl">
								🗒️ <span className="text-base">→</span>
							</i>
						</Button> */}
						<div className="flex justify-between w-full md:flex-col md:justify-start md:w-fit text-left">
							<p className="text-xs text-text-muted font-bold md:p-1 m-0 text-balance">
								created: <br />
								{selected
									? new Date(selected.createdAt).toLocaleString()
									: " - "}
							</p>

							<p className="text-right md:text-left text-text-muted text-xs text-balance md:p-1 m-0">
								last updated: <br />
								{selected
									? new Date(selected.updatedAt).toLocaleString()
									: " - "}
							</p>
						</div>
						<div className="flex flex-nowrap justify-end gap-3 py-3 md:py-0 h-[65px] md:h-fit">
							{!showForm.show && selected && (
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
					<p className="card w-full max-w-[600px] min-h-[100px] p-6 text-center text-balance whitespace-pre-line">
						{selected.content}
					</p>
				</div>
			)}

			{!showForm.show && !selected && (
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
			)}
		</section>
	);
};

export default NotePreview;
