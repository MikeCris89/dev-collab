import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export type SetShowForm = React.Dispatch<React.SetStateAction<ShowForm>>;

// export type ShowForm = string | null;
export type ShowForm = { show: boolean; form: string | null };

interface Selected {
	p: string | null;
	f: string | null;
	n: string | null;
}

interface GlobalCtx {
	// notes: Note[];
	selected: Selected;
	setSelected: React.Dispatch<React.SetStateAction<Selected>>;
	// isLoading: boolean;
	// error: string | null;
	showForm: ShowForm;
	showMenu: boolean;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	setShowForm: SetShowForm;
	// refetch: () => Promise<void>;
	// addNote: (note: NoteInput) => Promise<void>;
	// updateNote: (id: string, note: NoteInput) => Promise<void>;
	// deleteNote: (id: string) => Promise<void>;
	toggleMenu: () => void;
}

export const GlobalContext = createContext<GlobalCtx | undefined>(undefined);

const GlobalProvider = ({ children }: React.PropsWithChildren) => {
	const params = useParams() as {
		projectId?: string;
		folderId?: string;
		noteId?: string;
	};
	const { pathname } = useLocation();

	const [selected, setSelected] = useState<Selected>({
		p: null,
		f: null,
		n: null,
	});
	// const [notes, setNotes] = useState<Note[]>([]);
	// const [selected, setSelected] = useState<Note | null>(null);
	const [showForm, setShowForm] = useState<ShowForm>({
		show: false,
		form: null,
	});
	const [showMenu, setShowMenu] = useState(false);

	// adjust selected items on change of params
	useEffect(() => {
		const select: Selected = {
			p: null,
			f: null,
			n: null,
		};
		if (params.projectId) {
			select.p = params.projectId;
			if (params.folderId) {
				select.f = params.folderId;
				if (params.noteId) {
					select.n = params.noteId;
				}
			}
		}
		setSelected(select);
	}, [params]);

	// Set ShowForm for toolbar action buttons
	useEffect(() => {
		if (
			(pathname.endsWith("/new") || pathname.endsWith("/edit")) &&
			!showForm.show
		)
			setShowForm((prev) => ({ ...prev, show: true }));
		else if (
			!pathname.endsWith("/new") &&
			!pathname.endsWith("/edit") &&
			showForm.show
		)
			setShowForm((prev) => ({ ...prev, show: false }));
	}, [pathname]);

	// const [isFetching, setIsFetching] = useState(true);
	// const [isAdding, setIsAdding] = useState(false);
	// const [isUpdating, setIsUpdating] = useState(false);
	// const [isDeleting, setIsDeleting] = useState(false);
	// const [error, setError] = useState<string | null>(null);

	// const fetchNotes = async () => {
	// 	try {
	// 		setError(null);
	// 		setIsFetching(true);
	// 		const resp = await api.get("/api/notes");
	// 		if (resp.data) setNotes(resp.data);
	// 	} catch (e) {
	// 		setError("Error fetching notes");
	// 	} finally {
	// 		setIsFetching(false);
	// 	}
	// };

	// useEffect(() => {
	// 	(async () => {
	// 		await fetchNotes();
	// 	})();
	// }, []);

	// const addNote = async (note: NoteInput) => {
	// 	try {
	// 		setError(null);
	// 		setIsAdding(true);
	// 		const resp = await api.post("/api/notes", note);
	// 		if (resp.data) setNotes((prev) => [...prev, resp.data]);
	// 	} catch (e) {
	// 		setError("Error adding note");
	// 	} finally {
	// 		setIsAdding(false);
	// 		setShowForm({ show: false, note: null });
	// 	}
	// };

	// const updateNote = async (id: string, note: NoteInput) => {
	// 	try {
	// 		setError(null);
	// 		setIsUpdating(true);
	// 		const resp = await api.put(`/notes/${id}`, note);
	// 		if (resp.data)
	// 			setNotes((prev) =>
	// 				prev.map((note) => (note.id === id ? resp.data : note))
	// 			);
	// 	} catch (e) {
	// 		setError("Error updating note");
	// 	} finally {
	// 		setIsUpdating(false);
	// 		setShowForm({ show: false, note: null });
	// 	}
	// };

	// const deleteNote = async (id: string) => {
	// 	try {
	// 		setError(null);
	// 		setIsDeleting(true);
	// 		await api.delete(`/api/notes/${id}`);
	// 		setNotes((prev) => prev.filter((note) => note.id !== id));
	// 	} catch (e) {
	// 		setError("Error deleting note");
	// 	} finally {
	// 		setIsDeleting(false);
	// 	}
	// };

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	return (
		<GlobalContext.Provider
			value={{
				// notes,
				selected,
				setSelected,
				// isLoading: isFetching || isAdding || isUpdating || isDeleting,
				// error,
				// refetch: fetchNotes,
				// addNote,
				// updateNote,
				// deleteNote,
				showForm,
				setShowForm,
				showMenu,
				setShowMenu,
				toggleMenu,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;

export const useGlobal = () => {
	const ctx = useContext(GlobalContext);
	if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
	return ctx;
};
