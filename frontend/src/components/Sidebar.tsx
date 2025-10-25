import clsx from "clsx";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProject } from "@/hooks/useProjects";
import {
	ChevronLeft,
	Edit2,
	Trash2,
	UserCircle2Icon,
	UsersRound,
} from "lucide-react";
import ListItem from "./ListItem";
import { useTeamProjects } from "@/hooks/useTeam";
import { NavLink, useLocation, useParams } from "react-router-dom";
import Loading from "./Loading";
import { useFolderNotes } from "@/hooks/useNotes";

const Sidebar = () => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const { pathname } = useLocation();
	const { projectId, folderId, noteId } = useParams();

	const { selected, setSelected, showMenu, setShowMenu, toggleMenu, nav } =
		useGlobal();

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

	const {
		data: folderNotes,
		isLoading: loadingFolder,
		error: errorFolder,
	} = useFolderNotes({ projectId: selected.p, folderId: selected.f });

	useEffect(() => {
		if (!showMenu) return;
		// Return if not in mobile view
		if (document.documentElement.clientWidth >= 768) {
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
	}, [showMenu, setShowMenu]);

	const page = selected.page;

	const parentTitle: string | null = useMemo(
		() =>
			selected.page === "f"
				? projects.find((p) => p.id === selected.p)?.title || null
				: selected.page === "n"
				? project?.folders.find((f) => f.id === selected.f)?.title || null
				: null,
		[selected, projects, project]
	);

	const filtered = useMemo(() => {
		const data = {
			p: projects,
			f: project?.folders ?? [],
			n: folderNotes ?? [],
		};

		if (search) {
			return data[selected.page].filter(
				(el) =>
					el.title?.toLowerCase().includes(search.toLowerCase()) ||
					("body" in el &&
						el.body?.toLowerCase().includes(search.toLowerCase()))
			);
		}

		return data[selected.page];
	}, [search, projects, project, selected, folderNotes]);

	const isLoading = loadingProject || loadingProjects || loadingFolder;
	const error = errorProject || errorProjects || errorFolder;

	if (!isLoading && error)
		throw new Error(
			errorProjects?.message ??
				errorProject?.message ??
				errorFolder?.message ??
				"Error fetching project data"
		);

	const parent = page === "f" ? "p" : "f";

	return (
		<section
			ref={sidebarRef}
			className={clsx(
				"absolute left-0 -translate-x-full md:static md:inset-auto  md:translate-x-0",
				"flex flex-col",
				" h-screen w-[250px] max-w-screen md:h-full md:w-[300px] bg-bg-surface  p-1 py-4 border-r border-r-border-medium shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300 z-50 backdrop-blur-sm ",
				showMenu && "translate-x-0"
			)}
		>
			{/* Mobile Menu Button */}
			<Button
				className={clsx(
					"md:hidden absolute left-full rounded-[0_14px_14px_0] !py-2 !px-0 !min-w-[50px] top-3"
				)}
				variant="menu"
				onClick={toggleMenu}
			>
				<i className="flex items-center justify-center text-2xl">
					🗒️ <span className="text-base">{showMenu ? <i>←</i> : <i>→</i>}</span>
				</i>
			</Button>

			<h3 className="text-accent text-sm md:text-base font-bold p-0 m-0">
				DevCollab
			</h3>

			{/* Account & Team buttons */}
			<div className="flex justify-between items-center w-full p-2 mb-2">
				<NavLink
					className={clsx(
						"flex items-center hover:text-accent gap-2 p-2 rounded-md",
						pathname.includes("/account") && "bg-accent-hover text-accent"
					)}
					to="/account"
					onClick={() => setShowMenu(false)}
				>
					<UserCircle2Icon size={22} /> <span>Account</span>
				</NavLink>
				<NavLink
					className={clsx(
						"flex items-center gap-2 hover:text-accent p-2 rounded-md ",
						pathname.includes("/team") && "bg-accent-hover text-accent"
					)}
					to="/team"
					onClick={() => setShowMenu(false)}
				>
					<UsersRound size={22} />
					<span>Team</span>
				</NavLink>
			</div>

			{/* SEARCH BAR & NEW BTN */}
			<div className="flex flex-col gap-4 p-2 pb-4 w-full border-b-border-medium border-b">
				<div className="flex items-center justify-between">
					<h2 className="text-left font-bold text-lg">{nav[page].title}</h2>

					<Button
						variant="primary"
						onClick={() => {
							setShowMenu(false);
						}}
						className="flex gap-1 items-center"
						href={`${nav[page].formUrl}?action=add&formId=${nav[page].formId}`}
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

			{/* SECTION / back btn */}
			<div className="flex justify-between items-center w-full p-2 h-14">
				{(selected.p || selected.f) && (
					<>
						<div
							className="flex items-center gap-1 text-left cursor-pointer hover:text-accent "
							onClick={() => {
								if (selected.f) setSelected((prev) => ({ ...prev, f: null }));
								else if (selected.p)
									setSelected((prev) => ({ ...prev, p: null }));
							}}
						>
							<ChevronLeft size={16} className="shrink-0" />
							<i className="shrink-0">{nav[page].parentIcon}</i>
							<p className="text-sm font-bold text-balance line-clamp-2 text-ellipsis">
								{parentTitle}
							</p>
						</div>
						{/* Edit / Delete Btns */}
						<div className="flex gap-6 items-center justify-end">
							<NavLink
								className="cursor-pointer hover:text-accent"
								to={`${nav[parent].formEditUrl}?action=edit&formId=${nav[parent].formId}`}
								onClick={() => setShowMenu(false)}
								state={{ from: pathname }}
							>
								<Edit2 size={20} />
							</NavLink>
							<i className="cursor-pointer hover:text-red-500">
								<Trash2 size={20} />
							</i>
						</div>
					</>
				)}
			</div>

			{/* List */}
			<div className="sidebar-list flex-1 flex flex-col gap-4 justify-start items-center min-h-0 overflow-y-auto overflow-x-hidden p-1 h-full">
				{/* Loading - Item List */}
				{isLoading ? (
					<Loading />
				) : !isLoading && filtered && filtered?.length > 0 ? (
					filtered.map((el) => {
						// const navSel = selected[page] === el.id;
						const paramSel =
							el.id === projectId || el.id === noteId || el.id === folderId;

						// const isSel = navSel || paramSel;

						return (
							<ListItem
								title={el.title}
								createdAt={el.createdAt}
								body={"body" in el ? el.body : undefined}
								selected={paramSel}
								key={el.id}
								href={
									page === "n" && selected.p && selected.f
										? `/p/${selected.p}/f/${selected.f}/n/${el.id}`
										: paramSel || !!noteId
										? undefined
										: "/"
								}
								onClick={() => {
									setTimeout(() => {
										if (page === "p")
											setSelected((prev) => ({ ...prev, p: el.id }));
										if (page === "f")
											setSelected((prev) => ({ ...prev, f: el.id }));
										if (page === "n" && selected.p && selected.f) {
											setShowMenu(false);
										}
									}, 200);
								}}
								icon={nav[page].icon}
								page={page}
							/>
						);
					})
				) : (
					<p className="m-auto">
						No {search ? "search results.." : nav[page].title}
					</p>
				)}
			</div>
		</section>
	);
};

export default Sidebar;
