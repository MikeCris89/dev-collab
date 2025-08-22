import { useState } from "react";
import type { Note } from "../../lib/types";
import { useNotes } from "../../context/NotesContext";

const Notes = () => {
	const { notes, isLoading, error } = useNotes();
	const [selected, setSelected] = useState<Note | null>(null);

	return (
		<div className="flex justify-between items-center h-full w-full">
			<section className="hidden md:flex md:flex-col  h-[95%]  w-[300px] bg-neutral-700 p-3 rounded-lg">
				<input placeholder="search..." />
				<div className="flex justify-between items-center">
					<h2>My Notes</h2>
					<button>+New Note</button>
				</div>
				<div className="divide-y divide-neutral-300">
					{(isLoading ? <p>Loading notes...</p> : notes.length > 0) ? (
						notes.map((note) => {
							return <h3 onClick={() => setSelected(note)}>{note.title}</h3>;
						})
					) : (
						<h3>No Notes</h3>
					)}
				</div>
			</section>
			<section className="flex-1 flex flex-col gap-3 justify-start items-center h-[95%]">
				{error ? (
					<h2>Error: {error}</h2>
				) : selected ? (
					<>
						<div className="flex justify-between items-center p-2">
							<div>
								<p>
									created: {new Date(selected.createdAt).toLocaleDateString()}
								</p>
								<p>
									last updated:{" "}
									{new Date(selected.updatedAt).toLocaleDateString()}
								</p>
							</div>
							<div className="self-end flex gap-3">
								<button>edit</button>
								<button>delete</button>
							</div>
						</div>
						<h1>{selected.title}</h1>
						<p>{selected.content}</p>
					</>
				) : (
					<h2>No Note Selected...</h2>
				)}
			</section>
		</div>
	);
};

export default Notes;
