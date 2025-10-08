import clsx from "clsx";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import { useProject } from "@/hooks/useProjects";
import { UserCircle2Icon, UsersRound } from "lucide-react";
import ProjectSelection from "./ProjectSelection";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const { logout } = useAuth();
	const navigate = useNavigate();

	const {
		selected,
		// setSelected,
		// setShowForm,
		// showForm,
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
	} = useProjects();

	const {
		data: project,
		isLoading: loadingProject,
		error: errorProject,
	} = useProject(selected.p);

	useEffect(() => {
		if (selected.p) setShowProject(selected.p);
	}, []);

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

	// const filtered: Note[] = useMemo(() => {
	// 	if (search) {
	// 		return notes.filter(
	// 			(el) =>
	// 				el.title.toLowerCase().includes(search.toLowerCase()) ||
	// 				el.body.toLowerCase().includes(search.toLowerCase())
	// 		);
	// 	}
	// 	return notes;
	// }, [search, notes]);

	return (
		<section
			ref={sidebarRef}
			className={clsx(
				"absolute left-0 -translate-x-full md:static md:inset-auto  md:translate-x-0  grid grid-rows-[auto_1fr] gap-4 h-screen w-[250px] max-w-screen md:h-full md:w-[300px] bg-bg-surface  p-1 py-4 border-r border-r-border-medium shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300 z-50 backdrop-blur-sm ",
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

			<Button onClick={logout}>logout</Button>

			{/* Account buttons */}
			<div className="flex flex-col gap-4 items-stretch px-2">
				<div className="flex justify-between items-center">
					<div className="hover:font-bold cursor-pointer flex gap-2">
						<UserCircle2Icon /> <span>Account</span>
					</div>
					<ThemeSwitcher />
				</div>
				<Button
					className="flex justify-between gap-2 p-2 outline rounded-md"
					onClick={() => navigate("/team")}
				>
					<p>Team</p>
					<UsersRound />
				</Button>
			</div>

			{showProject && (
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
					{/* TODO - ADD NEW FOLDER BTN  */}
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
			)}

			{/* List */}
			<div className="sidebar-list flex-1 flex flex-col gap-2 justify-start items-center min-h-0 overflow-y-auto p-1">
				{/* Loading */}

				{/* Projects */}
				{!showProject && projects?.length > 0 ? (
					projects.map((p) => (
						<ProjectSelection title={p.title} selected={selected.p === p.id} />
					))
				) : (
					<p className="m-auto">No Projects</p>
				)}

				{/* Notes */}
				{/* {filtered.map((note) => {
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

				<p className="m-auto">No Notes</p>
			</div>
		</section>
	);
};

export default Sidebar;
