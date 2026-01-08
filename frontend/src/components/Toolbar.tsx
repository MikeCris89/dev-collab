import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import clsx from "clsx";
import { FORMS } from "@shared/contract";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useEffect, useState } from "react";
import { Trash2, UserCircle2, Users2, X } from "lucide-react";
import { useDeleteNote } from "@/hooks/useNotes";
import { useDeleteModal } from "@/context/DeleteModalContext";
import { useDeleteFolder } from "@/hooks/useFolders";
import { useDeleteProject } from "@/hooks/useProjects";

const NoteBar = () => {
	const { allowNav, setSelected, formDirty } = useGlobal();
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

	const showForm = !!action && !!formId;

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
		}
	};

	const deleteModal = {
		type: isNote ? "Note" : isFolder ? "Folder" : isProject ? "Project" : "",
		name: "",
		onConfirm: handleDelete,
	};

	return (
		<div className="flex flex-col w-full h-fit px-5 py-3 gap-3">
			{showForm && (
				<>
					<div className="flex ml-[30px] md:ml-0 justify-around md:justify-between items-center w-full">
						<Button
							className="flex gap-2 items-center cursor-pointer hover:text-red-500"
							onClick={() => setShowModal(deleteModal)}
							variant="link"
						>
							<Trash2 size={18} />{" "}
							<span className="hidden md:block">delete</span>
						</Button>

						<div className="flex gap-3 justify-self-end">
							<Button
								onClick={() => {
									const from = location.state?.from;
									allowNav();

									if (!from) {
										navigate("/", { replace: !isNote });
									} else {
										navigate(-1);
									}
								}}
								className="flex gap-2 items-center"
							>
								<i className="h-[15px] text-sm">❌</i> <span>cancel</span>
							</Button>
							<Button
								type="submit"
								form={formId}
								variant="primary"
								disabled={!formDirty}
								className="flex gap-2 items-center"
							>
								<i className="h-[15px] text-sm">{formDirty ? "✅" : "☑️"} </i>
								<span>save</span>
							</Button>
						</div>
					</div>
					<div className="flex justify-between w-full text-left">
						<p className="text-xs text-text-muted font-bold md:p-1 m-0 text-balance">
							created: <br />
							{/* {selected
									? new Date(selected.n.createdAt).toLocaleString()
									: " - "} */}
						</p>

						<p className="text-right md:text-left text-text-muted text-xs text-balance md:p-1 m-0">
							last updated: <br />
							{/* {selected
									? new Date(selected.n.updatedAt).toLocaleString()
									: " - "} */}
						</p>
					</div>
				</>
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
				"flex items-center justify-center w-full bg-bg-elevated border-b border-b-border-light min-h-[70px] relative flex-nowrap p-2"
			)}
		>
			{!isNote && !isForm && title.title && (
				<div className="grid grid-cols-[70px_1fr_70px]">
					<div className=" col-start-2 flex gap-2 items-center justify-center flex-nowrap">
						<i className="text-accent shrink-0">{title.icon}</i>
						<h1 className="w-fit p-0 m-0 text-2xl text-left text-balance">
							{title.title}
						</h1>
					</div>
				</div>
			)}

			{(isNote || isForm) && <NoteBar />}
		</div>
	);
};

export default Toolbar;
