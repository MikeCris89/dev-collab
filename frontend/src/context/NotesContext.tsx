import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Note, NoteInput } from "@shared/contract";

export type SetShowForm = React.Dispatch<React.SetStateAction<ShowForm>>;

export type ShowForm = {
	show: boolean;
	note: Note | null;
};

interface NotesCtx {
	notes: Note[];
	selected: Note | null;
	setSelected: React.Dispatch<React.SetStateAction<Note | null>>;
	isLoading: boolean;
	error: string | null;
	showForm: ShowForm;
	showMenu: boolean;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	setShowForm: SetShowForm;
	refetch: () => Promise<void>;
	addNote: (note: NoteInput) => Promise<void>;
	updateNote: (id: string, note: NoteInput) => Promise<void>;
	deleteNote: (id: string) => Promise<void>;
	toggleMenu: () => void;
}

export const NotesContext = createContext<NotesCtx | undefined>(undefined);

const NotesProvider = ({ children }: React.PropsWithChildren) => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [selected, setSelected] = useState<Note | null>(null);
	const [showForm, setShowForm] = useState<ShowForm>({
		show: false,
		note: null,
	});
	const [showMenu, setShowMenu] = useState(false);

	const [isFetching, setIsFetching] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchNotes = async () => {
		try {
			setError(null);
			setIsFetching(true);
			const resp = await api.get("/api/notes");
			if (resp.data) setNotes(resp.data);
		} catch (e) {
			setError("Error fetching notes");
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		(async () => {
			await fetchNotes();
		})();
	}, []);

	const addNote = async (note: NoteInput) => {
		try {
			setError(null);
			setIsAdding(true);
			const resp = await api.post("/api/notes", note);
			if (resp.data) setNotes((prev) => [...prev, resp.data]);
		} catch (e) {
			setError("Error adding note");
		} finally {
			setIsAdding(false);
			setShowForm({ show: false, note: null });
		}
	};

	const updateNote = async (id: string, note: NoteInput) => {
		try {
			setError(null);
			setIsUpdating(true);
			const resp = await api.put(`/api/notes/${id}`, note);
			if (resp.data)
				setNotes((prev) =>
					prev.map((note) => (note.id === id ? resp.data : note))
				);
		} catch (e) {
			setError("Error updating note");
		} finally {
			setIsUpdating(false);
			setShowForm({ show: false, note: null });
		}
	};

	const deleteNote = async (id: string) => {
		try {
			setError(null);
			setIsDeleting(true);
			await api.delete(`/api/notes/${id}`);
			setNotes((prev) => prev.filter((note) => note.id !== id));
		} catch (e) {
			setError("Error deleting note");
		} finally {
			setIsDeleting(false);
		}
	};

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	return (
		<NotesContext.Provider
			value={{
				notes,
				selected,
				setSelected,
				isLoading: isFetching || isAdding || isUpdating || isDeleting,
				error,
				refetch: fetchNotes,
				addNote,
				updateNote,
				deleteNote,
				showForm,
				setShowForm,
				showMenu,
				setShowMenu,
				toggleMenu,
			}}
		>
			{children}
		</NotesContext.Provider>
	);
};

export default NotesProvider;

export const useNotes = () => {
	const ctx = useContext(NotesContext);
	if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
	return ctx;
};
