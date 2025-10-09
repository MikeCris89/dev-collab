import clsx from "clsx";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import { useProject } from "@/hooks/useProjects";
import {
	Folder,
	Layers,
	NotepadText,
	UserCircle2Icon,
	UsersRound,
} from "lucide-react";
import ProjectSelection from "./ProjectSelection";
import { useTeamProjects } from "@/hooks/useProjects";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SidebarList from "./SidebarList";

const Sidebar = () => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const { logout } = useAuth();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const params = useParams();

	const {
		selected,
		setSelected,
		setShowForm,
		showForm,
		showMenu,
		setShowMenu,
		toggleMenu,
	} = useGlobal();

	const [search, setSearch] = useState<string | null>(null);

	const [showProject, setShowProject] = useState<string | null>(null);
	const [showFolder, setShowFolder] = useState<string | null>(null);

	const {
		data: projects = [],
		isLoading: loadingProjects,
		error: errorProjects,
	} = useTeamProjects();

	const {
		data: project,
		isLoading: loadingProject,
		error: errorProject,
	} = useProject(selected.p);

	useEffect(() => {
		if (selected.p && !showProject) {
			if (selected.f && !showFolder) {
				setShowFolder(selected.f);
			}
			setShowProject(selected.p);
		}
	}, [selected]);

	useEffect(() => {
		if (!showMenu) return;
		// Return if not in mobile view
		if (document.documentElement.clientWidth >= 768) {
			console.log("HERE");
			setShowMenu(false);
			return;
		}

		const listener = (e: MouseEvent) => {
			if (!sidebarRef.current) return;

			if (!sidebarRef.current.contains(e?.target as Node)) setShowMenu(false);
		};

		document.addEventListener("mousedown", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
		};
	}, [showMenu]);

	const nav = {
		p: {
			title: "Projects",
			newLabel: "New Project",
			searchLabel: "Search projects",
			newFormId: "project-form",
			newFormUrl: "/p/new",
			editFormUrl: undefined,
			current: undefined,
			currentIcon: undefined,
			icon: <Layers />,
		},
		f: {
			title: "Folders",
			newLabel: "New Folder",
			searchLabel: "Search folders",
			newFormId: "folder-form",
			newFormUrl: `${pathname}/f/new`,
			editFormUrl: showProject ? `/p/${showProject}/edit` : "#",
			current: showProject
				? projects.find((p) => p.id === showProject)?.title
				: "",
			currentIcon: <Layers />,
			icon: <Folder />,
		},
		n: {
			title: "Notes",
			newLabel: "New Note",
			searchLabel: "Search notes",
			newFormId: "note-form",
			newFormUrl: `${pathname}/n/new`,
			editFormUrl: showFolder ? `${pathname}/f/${showFolder}/edit` : "#",
			current: showFolder ? "" : "",
			currentIcon: <Folder />,
			icon: <NotepadText />,
		},
	};

	const page = !showProject ? "p" : !showFolder ? "f" : "n";

	const filtered = useMemo(() => {
		const data = {
			p: projects,
			f: folders,
			n: notes,
		};
		if (search) {
			return data[page].filter(
				(el) =>
					el.title?.toLowerCase().includes(search.toLowerCase()) ||
					el.body?.toLowerCase().includes(search.toLowerCase())
			);
		}
		return data[page];
	}, [search, projects, folders, notes]);

	return (
		<section
			ref={sidebarRef}
			className={clsx(
				"absolute left-0 -translate-x-full md:static md:inset-auto  md:translate-x-0",
				// " grid grid-rows-[auto_1fr]",
				"flex flex-col",
				" gap-4 h-screen w-[250px] max-w-screen md:h-full md:w-[300px] bg-bg-surface  p-1 py-4 border-r border-r-border-medium shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300 z-50 backdrop-blur-sm ",
				showMenu && "translate-x-0"
			)}
		>
			{/* Mobile Menu Button */}
			<Button
				className={clsx(
					"md:hidden absolute left-full rounded-[0_14px_14px_0] !py-2 !px-0 !min-w-[50px] top-3"

					// `top-[${noteBarRef.current ?? 150}px]`
				)}
				variant="menu"
				onClick={toggleMenu}
			>
				<i className="flex items-center justify-center text-2xl">
					🗒️ <span className="text-base">{showMenu ? <i>←</i> : <i>→</i>}</span>
				</i>
			</Button>

			{/* Account & Team buttons */}
			<div className="flex flex-col gap-4 items-stretch px-2 h-fit">
				<div
					onClick={logout}
					className="self-start cursor-pointer hover:font-bold"
				>
					logout
				</div>
				<div className="flex justify-between items-center">
					<div className="hover:font-bold cursor-pointer flex gap-2">
						<UserCircle2Icon /> <span>Account</span>
					</div>
					<ThemeSwitcher />
				</div>
				<Button
					className={clsx(
						"flex justify-between gap-2 p-2 outline rounded-md",
						pathname.includes("/team") && "bg-neutral-600"
					)}
					onClick={() => navigate("/team")}
				>
					<p>Team</p>
					<UsersRound />
				</Button>
			</div>

			{/* {showProject && (
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
					<Button
						variant="primary"
						// onClick={() => {
						// 	setShowForm({ show: true, note: null });
						// 	setSelected(null);
						// 	setShowMenu(false);
						// }}
						// disabled={showForm.show}
					>
						⊕ New Note
					</Button>
				</div>
			)} */}

			{/* SEARCH BAR & NEW BTN */}
			<div className="flex flex-col gap-4 p-2 pb-4 w-full border-b-border-medium border-b">
				<div className="search-container relative">
					<span className="search-icon">🔍</span>
					<input
						placeholder={nav[page].searchLabel}
						className="w-full pl-11"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<h2 className="text-left font-bold text-lg">{nav[page].current}</h2>
				<h2 className="text-left font-bold text-lg">{nav[page].title}</h2>

				<Button
					variant="primary"
					onClick={() => {
						setShowForm((prev) => ({ ...prev, form: nav[page].newFormId }));
						// setSelected({
						// 	p: null,
						// 	f: null,
						// 	n: null,
						// });
						setShowMenu(false);
						navigate(nav[page].newFormUrl);
					}}
					disabled={showForm.show}
				>
					{nav[page].newLabel}
				</Button>
			</div>

			{/* List */}
			<div className="sidebar-list flex-1 flex flex-col gap-2 justify-start items-center min-h-0 overflow-y-auto p-1">
				{/* Loading */}

				{/* Projects */}
				{filtered && filtered?.length > 0 ? (
					filtered.map((el) => (
						<ProjectSelection
							title={el.title}
							selected={selected[page] === el.id}
							key={el.id}
							onClick={() => navigate(`/p/${el.id}`)}
						/>
					))
				) : (
					<p className="m-auto">
						No {search ? "search results.." : nav[page].title}
					</p>
				)}

				{/* Notes */}
				{/* {showProject && filtered.map((note) => {
					return (
						<button
							key={note.id}
							className={clsx(
								"flex flex-col gap-1 justify-center items-start w-full h-[150px] border-b border-b-border-light shadow-sm cursor-pointer group enabled:hover:bg-accent-hover ease-in duration-100 p-2 ",
								note.id === selected?.id &&
									"border-l-4 border-l-accent font-bold bg-accent/30 shadow-lg enabled:hover:bg-accent/30"
							)}
							onClick={() => {
								setSelected(note);
								setTimeout(() => {
									setShowMenu(false);
								}, 150);
							}}
							disabled={showForm.show}
						>
							<h3
								className={clsx(
									"text-lg",
									showForm.show ? "" : "group-hover:font-bold"
								)}
							>
								{note.title}
							</h3>
							<small className="line-clamp-2 text-left">{note.body}</small>
							<small>{new Date(note.createdAt).toLocaleDateString()}</small>
						</button>
					);
				})} */}

				{/* <p className="m-auto">No Notes</p> */}
			</div>
		</section>
	);
};

export default Sidebar;
