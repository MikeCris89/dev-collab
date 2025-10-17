import { FORMS } from "@shared/contract";
import { Folder, Layers, NotepadText } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface Nav {
	p: {
		title: string;
		newLabel: string;
		searchLabel: string;
		selectUrl: string;
		newFormId: string;
		newFormUrl: string;
		editFormUrl: undefined;
		parentIcon: undefined;
		icon: React.ReactNode;
	};
	f: {
		title: string;
		newLabel: string;
		searchLabel: string;
		selectUrl: string;
		newFormId: string;
		newFormUrl: string;
		editFormUrl: string;
		parentIcon: React.ReactNode;
		icon: React.ReactNode;
	};
	n: {
		title: string;
		newLabel: string;
		searchLabel: string;
		selectUrl: string;
		newFormId: string;
		newFormUrl: string;
		editFormUrl: string;
		parentIcon: React.ReactNode;
		icon: React.ReactNode;
	};
}

export type SetShowForm = React.Dispatch<React.SetStateAction<ShowForm>>;
export type ShowForm = { show: boolean; form: string | null };

interface Selected {
	p: string | null;
	f: string | null;
	n: string | null;
	page: "p" | "f" | "n";
}

export const selectInit: Selected = {
	p: null,
	f: null,
	n: null,
	page: "p",
};

interface GlobalCtx {
	selected: Selected;
	setSelected: React.Dispatch<React.SetStateAction<Selected>>;
	showForm: ShowForm;
	showMenu: boolean;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	setShowForm: SetShowForm;
	closeForm: () => void;
	toggleMenu: () => void;
	nav: Nav;
}

export const GlobalContext = createContext<GlobalCtx | undefined>(undefined);

const GlobalProvider = ({ children }: React.PropsWithChildren) => {
	const { pathname } = useLocation();

	const [selected, setSelected] = useState<Selected>({ ...selectInit });
	const [showForm, setShowForm] = useState<ShowForm>({
		show: false,
		form: null,
	});
	const [showMenu, setShowMenu] = useState(false);

	// set selected.page based on selected id's
	useEffect(() => {
		let page: "p" | "f" | "n" = "p";
		if (selected.p) page = "f";
		if (selected.f) page = "n";
		if (selected.page !== page) setSelected((prev) => ({ ...prev, page }));
	}, [selected]);

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

	const closeForm = () => setShowForm({ show: false, form: null });

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	const nav = useMemo(
		() => ({
			p: {
				title: "Projects",
				newLabel: "New Project",
				searchLabel: "Search projects",
				selectUrl: `/p`,
				newFormId: FORMS.p,
				newFormUrl: "/p/new",
				editFormUrl: undefined,
				parentIcon: undefined,
				icon: <Layers />,
			},
			f: {
				title: "Folders",
				newLabel: "New Folder",
				searchLabel: "Search folders",
				selectUrl: `/p/${selected.p}/f`,
				newFormId: FORMS.f,
				newFormUrl: `/p/${selected.p}/f/new`,
				editFormUrl: selected.p ? `/p/${selected.p}/edit` : "",
				parentIcon: <Layers />,
				icon: <Folder />,
			},
			n: {
				title: "Notes",
				newLabel: "New Note",
				searchLabel: "Search notes",
				selectUrl: `/p/${selected.p}/f/${selected.f}/n`,
				newFormId: FORMS.n,
				newFormUrl: `/p/${selected.p}/f/${selected.f}/n/new`,
				editFormUrl: selected.f ? `/p/${selected.p}/f/${selected.f}/edit` : "",
				parentIcon: <Folder />,
				icon: <NotepadText />,
			},
		}),
		[selected]
	);

	return (
		<GlobalContext.Provider
			value={{
				selected,
				setSelected,
				showForm,
				setShowForm,
				closeForm,
				showMenu,
				setShowMenu,
				toggleMenu,
				nav,
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
