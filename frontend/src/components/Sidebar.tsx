import clsx from "clsx";
import { useNotes } from "../context/NotesContext";
import Button from "./Button";
import { useMemo, useState } from "react";
import type { Note } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";

const Sidebar = () => {
	const { logout } = useAuth();
	const { notes, isLoading, selected, setSelected, setShowForm } = useNotes();
	const [search, setSearch] = useState<string | null>(null);

	const filtered: Note[] = useMemo(() => {
		if (search) {
			return notes.filter(
				(el) =>
					el.title.toLowerCase().includes(search.toLowerCase()) ||
					el.content.toLowerCase().includes(search.toLowerCase())
			);
		}
		return notes;
	}, [search, notes]);

	return (
		<section className="bg-bg-surface hidden md:flex md:flex-col gap-4 h-full w-[300px] p-1 py-4 border-r border-r-border-medium shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] z-50 ">
			<div className="flex justify-between items-center">
				<div className="hover:font-bold cursor-pointer " onClick={logout}>
					Logout
				</div>
				<ThemeSwitcher />
			</div>
			<div className="flex flex-col gap-4 p-2 pb-4 w-full border-b-border-medium border-b">
				<div className="search-container relative">
					<span className="search-icon">🔍</span>
					<input
						placeholder="Search notes…"
						className="w-full pl-11"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<h2 className="text-left font-bold text-lg">My Notes</h2>
				{/* <button
					className="bg-accent hover:bg-accent btn-accent text-[15px] text-left py-3"
					onClick={() => setShowForm({ show: true, note: null })}
				>
					⊕ New Note
				</button> */}
				<Button
					variant="primary"
					onClick={() => setShowForm({ show: true, note: null })}
				>
					⊕ New Note
				</Button>
			</div>

			<div className="notes-list flex-1 flex flex-col justify-start items-center min-h-0 overflow-y-auto">
				{(isLoading ? <p>Loading notes...</p> : notes.length > 0) ? (
					filtered.map((note) => {
						return (
							<div
								key={note.id}
								className={clsx(
									"flex justify-center w-full min-h-[75px] border-b border-b-border-medium cursor-pointer group hover:bg-accent-hover",
									// "hover:border-l-4 hover:border-l-cyan-500 ",
									note.id === selected?.id &&
										"border-l-4 border-l-accent font-bold bg-accent-hover"
								)}
								onClick={() => setSelected(note)}
							>
								<h3 className="m-auto group-hover:font-bold ">{note.title}</h3>
							</div>
						);
					})
				) : (
					<h3>No Notes</h3>
				)}
			</div>
		</section>
	);
};

export default Sidebar;
