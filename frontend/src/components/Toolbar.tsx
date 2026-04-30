import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import clsx from "clsx";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useEffect, useState } from "react";
import { Check, Trash2, UserCircle2, Users2, X } from "lucide-react";
import { useDeleteNote } from "@/hooks/useNotes";
import { useDeleteModal } from "@/context/DeleteModalContext";
import { useDeleteFolder } from "@/hooks/useFolders";
import { useDeleteProject } from "@/hooks/useProjects";

const FormBar = () => {
	const { allowNav, setSelected, formDirty, setFormDirty } = useGlobal();
	const location = useLocation();
	const navigate = useNavigate();

	const { pathname } = location;
	const [action, formId] = useGetSearchParams(["action", "formId"]);
	const { mutate: deleteNote } = useDeleteNote();
	const { mutate: deleteFolder } = useDeleteFolder();
	const { mutate: deleteProject } = useDeleteProject();

	const { setShowModal } = useDeleteModal();

	const { noteId, folderId, projectId } = useParams();
	const isNote = noteId && folderId && projectId;
	const isFolder = !noteId && folderId && projectId;
	const isProject = !noteId && !folderId && projectId;

	const isTeamPage = pathname.startsWith("/team");
	const showForm = !!action && !!formId;
	const isAddAction = action === "add";

	const handleDelete = () => {
		allowNav();
		if (isNote) {
			navigate("/", { replace: true });
			setSelected((prev) => ({ ...prev, n: null }));
			deleteNote({ id: noteId, folderId, projectId });
		} else if (isFolder) {
			navigate("/", { replace: true });
			setSelected((prev) => ({ ...prev, n: null, f: null }));
			deleteFolder({ id: folderId, projectId });
		} else if (isProject) {
			navigate("/", { replace: true });
			setSelected((prev) => ({ ...prev, n: null, f: null, p: null }));
			deleteProject(projectId);
		} else if (isTeamPage) {
			return;
		}
	};

	const deleteModal = {
		type: isNote ? "Note" : isFolder ? "Folder" : isProject ? "Project" : "",
		name: "",
		onConfirm: handleDelete,
	};

	return (
		<div className="flex flex-col w-full px-3 md:px-5 py-2 gap-2">
			{showForm && (
				<div className="flex items-center justify-between w-full gap-2">
					{/* Left: delete or spacer */}
					<div className="min-w-[75px]">
						{!isAddAction && (
							<Button
								className="flex gap-1.5 items-center text-text-muted hover:text-red-500 transition-colors duration-200 p-0 min-w-0"
								onClick={() => setShowModal(deleteModal)}
								variant="link"
							>
								<Trash2 size={16} />
								<span className="hidden md:inline text-sm">delete</span>
							</Button>
						)}
					</div>

					{/* Right: cancel + save */}
					<div className="flex gap-2 items-center">
						<Button
							onClick={() => {
								allowNav();
								setFormDirty(false);
								navigate(isTeamPage ? "/team" : "/", {
									replace: !isNote || isTeamPage,
								});
							}}
							className="flex gap-1.5 items-center"
						>
							<X size={15} />
							<span>{formDirty ? "cancel" : "close"}</span>
						</Button>
						<Button
							type="submit"
							form={formId}
							variant="primary"
							disabled={!formDirty}
							className="flex gap-1.5 items-center"
							onClick={() => {
								setTimeout(() => {
									setFormDirty(false);
								}, 50);
							}}
						>
							<Check size={15} />
							<span>save</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

type Title = {
	title: string | null;
	icon: React.ReactNode | null;
};

const titleInit: Title = {
	title: null,
	icon: null,
};

const Toolbar = () => {
	const { selected, nav } = useGlobal();
	const [title, setTitle] = useState<Title>(titleInit);

	const location = useLocation();
	const { pathname } = location;
	const { noteId } = useParams();
	const [action] = useGetSearchParams(["action"]);

	useEffect(() => {
		const newTitle = { ...titleInit };
		if (pathname.startsWith("/team")) {
			newTitle.icon = <Users2 size={30} />;
			newTitle.title = "Team";
		} else if (pathname.startsWith("/account")) {
			newTitle.icon = <UserCircle2 size={30} />;
			newTitle.title = "Account";
		} else if (
			nav[selected.page].parentTitle &&
			nav[selected.page].parentIcon
		) {
			newTitle.icon = nav[selected.page].parentIcon ?? null;
			newTitle.title = nav[selected.page].parentTitle ?? null;
		}
		setTitle(newTitle);
	}, [pathname, noteId, selected, nav]);

	const isNote = !!noteId && !!selected.n;
	const isForm = !!action;

	return (
		<div
			id="note-bar"
			className={clsx(
				"flex items-center justify-center w-full bg-bg-elevated border-b border-b-border-light min-h-[56px] md:min-h-[64px] relative flex-nowrap",
			)}
		>
			{!isNote && !isForm && title.title && (
				<div className="grid grid-cols-[70px_1fr_70px]">
					<div className="col-start-2 flex gap-2 items-center justify-center flex-nowrap">
						<i className="text-accent shrink-0">{title.icon}</i>
						<h1 className="w-fit p-0 m-0 text-2xl text-left text-balance">
							{title.title}
						</h1>
					</div>
				</div>
			)}

			{(isNote || isForm) && <FormBar />}
		</div>
	);
};

export default Toolbar;
