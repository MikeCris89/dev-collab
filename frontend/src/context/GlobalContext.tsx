import { useFolder } from "@/hooks/useFolders";
import { useTeamProject, useTeamProjects } from "@/hooks/useTeam";
import useThemeSwitcher from "@/hooks/useThemeSwitcher";
import { FORMS } from "@shared/contract";
import { Folder, FolderOpen, Layers, NotepadText } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface NavEntry {
	title: string;
	newLabel: string;
	searchLabel: string;
	selectUrl: string;
	formId: string;
	formUrl: string;
	formEditUrl: string;
	parentIcon: React.ReactNode | undefined;
	parentTitle: string | undefined;
	icon: React.ReactNode;
}

interface Nav {
	p: NavEntry;
	f: NavEntry;
	n: NavEntry;
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
	showMenu: boolean;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	closeForm: () => void;
	toggleMenu: () => void;
	nav: Nav;
}

export const GlobalContext = createContext<GlobalCtx | undefined>(undefined);

const GlobalProvider = ({ children }: React.PropsWithChildren) => {
	const params = useParams();
	const { projectId, folderId, noteId } = params;
	const location = useLocation();
	const navigate = useNavigate();
	const [selected, setSelected] = useState<Selected>({ ...selectInit });
	const [showMenu, setShowMenu] = useState(false);
	useThemeSwitcher();

	const { data: project } = useTeamProject(selected.p);
	const { data: folder } = useFolder({
		projectId: selected.p,
		folderId: selected.f,
	});

	// set initial selected on page load
	useEffect(() => {
		let page: "p" | "f" | "n" = "p";
		if (projectId) page = "f";
		if (folderId) page = "n";
		if (selected.page !== page)
			setSelected({
				p: projectId ?? null,
				f: folderId ?? null,
				n: noteId ?? null,
				page,
			});
	}, []);

	useEffect(
		() =>
			setSelected((prev) => ({
				...prev,
				n: params.noteId ?? null,
			})),
		[params]
	);

	// set selected.page based on selected id's
	useEffect(() => {
		let page: "p" | "f" | "n" = "p";
		if (selected.p) page = "f";
		if (selected.f) page = "n";
		if (selected.page !== page) setSelected((prev) => ({ ...prev, page }));
	}, [selected]);

	const toggleMenu = () => {
		setShowMenu((prev) => !prev);
	};

	const closeForm = () => {
		if (location.state?.from) navigate(-1);
		else navigate("/", { replace: true });
	};

	const nav = useMemo(
		() => ({
			p: {
				title: "Projects",
				newLabel: "New Project",
				searchLabel: "Search projects",
				selectUrl: `/p`,
				formId: FORMS.p,
				formUrl: "/p",
				formEditUrl: `/p/${selected.p}`,
				parentIcon: undefined,
				parentTitle: undefined,
				icon: <Layers />,
			},
			f: {
				title: "Folders",
				newLabel: "New Folder",
				searchLabel: "Search folders",
				selectUrl: `/p/${selected.p}/f`,
				formId: FORMS.f,
				formUrl: `/p/${selected.p}/f`,
				formEditUrl: `/p/${selected.p}/f/${selected.f}`,
				parentIcon: <Layers />,
				parentTitle: project?.title,
				icon: <Folder />,
			},
			n: {
				title: "Notes",
				newLabel: "New Note",
				searchLabel: "Search notes",
				selectUrl: `/p/${selected.p}/f/${selected.f}/n`,
				formId: FORMS.n,
				formUrl: `/p/${selected.p}/f/${selected.f}/n`,
				formEditUrl: `/p/${selected.p}/f/${selected.f}/n/${selected.n}`,
				parentIcon: <FolderOpen />,
				parentTitle: folder?.title,
				icon: <NotepadText />,
			},
		}),
		[selected, folder, project]
	);

	return (
		<GlobalContext.Provider
			value={{
				selected,
				setSelected,
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
