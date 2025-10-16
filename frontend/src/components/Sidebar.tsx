import clsx from "clsx";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect, useMemo, useRef, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useProject } from "@/hooks/useProjects";
import { ChevronLeft, UserCircle2Icon, UsersRound } from "lucide-react";
import ListItem from "./ListItem";
import { useTeamProjects } from "@/hooks/useTeam";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { projectId, folderId, noteId } = useParams();

	const {
		selected,
		setSelected,
		setShowForm,
		showForm,
		showMenu,
		setShowMenu,
		toggleMenu,
		nav,
	} = useGlobal();

	const [search, setSearch] = useState<string | null>(null);

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

	const page = selected.page;

	const parentTitle: string | null = useMemo(
		() =>
			page === "f"
				? projects.find((p) => p.id === selected.p)?.title || null
				: page === "n"
				? project?.folders.find((f) => f.id === selected.f)?.title || null
				: null,
		[selected, projects, project]
	);

	const filtered = useMemo(() => {
		const data = {
			p: projects,
			f: project?.folders ?? [],
			n: project?.folders?.find((f) => f.id === selected.f)?.notes ?? [],
		};

		if (search) {
			return data[page].filter(
				(el) =>
					el.title?.toLowerCase().includes(search.toLowerCase()) ||
					("body" in el &&
						el.body?.toLowerCase().includes(search.toLowerCase()))
			);
		}

		return data[page];
	}, [search, projects, project, selected.page]);

	return (
		<section
			ref={sidebarRef}
			className={clsx(
				"absolute left-0 -translate-x-full md:static md:inset-auto  md:translate-x-0",
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
				<div className="flex justify-between items-center">
					<div className="flex items-center hover:font-bold cursor-pointer gap-2">
						<UserCircle2Icon size={18} /> <span>Account</span>
					</div>
					<ThemeSwitcher />
				</div>
				<NavLink
					className={clsx(
						"flex justify-between gap-2 p-2 outline rounded-md",
						pathname.includes("/team") && "bg-neutral-600"
					)}
					// onClick={() => navigate("/team")}
					to="/team"
				>
					<p>Team</p>
					<UsersRound />
				</NavLink>
			</div>

			{/* SEARCH BAR & NEW BTN */}
			<div className="flex flex-col gap-4 p-2 pb-4 w-full border-b-border-medium border-b">
				<div className="flex items-center justify-between">
					<h2 className="text-left font-bold text-lg">{nav[page].title}</h2>

					<Button
						variant="primary"
						onClick={() => {
							setShowForm((prev) => ({ ...prev, form: nav[page].newFormId }));
							setShowMenu(false);
							navigate(nav[page].newFormUrl);
						}}
						disabled={showForm.show}
						className="flex gap-1 items-center"
					>
						{nav[page].icon} New
					</Button>
				</div>
				<div className="search-container relative">
					<span className="search-icon">🔍</span>
					<input
						placeholder={nav[page].searchLabel}
						className="w-full pl-11 py-2 rounded-3xl"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* List */}
			<div className="sidebar-list flex-1 flex flex-col gap-4 justify-start items-center min-h-0 overflow-y-auto p-1">
				{/* Loading */}

				{/* SECTION / back btn */}
				{(selected.p || selected.f) && (
					<div
						className="flex items-center gap-1 text-left font-bold text-sm self-start cursor-pointer hover:text-accent mb-2"
						onClick={() => {
							if (selected.f) setSelected((prev) => ({ ...prev, f: null }));
							else if (selected.p)
								setSelected((prev) => ({ ...prev, p: null }));
						}}
					>
						<ChevronLeft size={16} />
						{nav[page].parentIcon}
						{parentTitle}
					</div>
				)}

				{/* Item List */}
				{filtered && filtered?.length > 0 ? (
					filtered.map((el) => {
						const navSel = selected[page] === el.id;
						const paramSel =
							el.id === projectId || el.id === noteId || el.id === folderId;

						const isSel = navSel || paramSel;

						return (
							<ListItem
								title={el.title}
								selected={isSel}
								key={el.id}
								href={
									page === "n" && selected.p && selected.f
										? `/p/${selected.p}/f/${selected.f}/n/${el.id}`
										: "/"
								}
								onClick={() => {
									setTimeout(() => {
										if (page === "p")
											setSelected((prev) => ({ ...prev, p: el.id }));
										if (page === "f")
											setSelected((prev) => ({ ...prev, f: el.id }));
										if (page === "n" && selected.p && selected.f) {
											// navigate(`/p/${selected.p}/f/${selected.f}/n/${el.id}`, {
											// 	state: pathname,
											// });
											setShowMenu(false);
										}
									}, 200);
								}}
								icon={nav[page].icon}
							/>
						);
					})
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
			</div>
		</section>
	);
};

export default Sidebar;
