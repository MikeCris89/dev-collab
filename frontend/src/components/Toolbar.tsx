import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Button from "./Button";
import clsx from "clsx";
import { FORMS } from "@shared/contract";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useEffect, useState } from "react";
import { UserCircle2, Users2 } from "lucide-react";
import { useDeleteNote } from "@/hooks/useNotes";

const NoteBar = () => {
	const { allowNav, setSelected } = useGlobal();
	const location = useLocation();
	const navigate = useNavigate();

	const { pathname } = location;
	const [action, formId] = useGetSearchParams(["action", "formId"]);
	const {
		mutateAsync: deleteNote,
		isPending,
		error,
		isSuccess,
	} = useDeleteNote();

	const { noteId, folderId, projectId } = useParams();

	const showForm = !!action && !!formId;

	const handleDelete = async () => {
		if (noteId && folderId && projectId)
			await deleteNote({ id: noteId, folderId, projectId });
		setSelected((prev) => ({ ...prev, n: null }));
		navigate("/", { replace: true });
	};

	return (
		<div className="flex flex-col-reverse md:flex-row justify-end items-start w-full h-full px-5 pt-2 md:pt-2 gap-3">
			{!showForm && (
				<div className="flex-1 flex md:flex-col justify-between md:justify-start w-full md:w-fit text-left">
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
			)}

			<div className="flex flex-nowrap gap-3 self-end md:self-start">
				{!showForm && noteId && (
					<>
						<Button
							onClick={() => {
								navigate(`${pathname}?action=edit&formId=${FORMS.n}`, {
									state: { from: pathname },
								});
							}}
						>
							✏️ edit
						</Button>
						<Button className="hover:text-red-500" onClick={handleDelete}>
							🗑️ delete
						</Button>
					</>
				)}
				{showForm && (
					<>
						<Button
							onClick={() => {
								const from = location.state?.from;
								allowNav();

								if (!from) {
									navigate("/");
								} else {
									navigate(-1);
								}
							}}
						>
							❌ cancel
						</Button>
						<Button type="submit" form={formId} variant="primary">
							save
						</Button>
					</>
				)}
			</div>
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

	// const { data: projects } = useTeamProjects();
	// const { data: folder } = useFolder({
	// 	projectId: selected.p,
	// 	folderId: selected.f,
	// });

	useEffect(() => {
		// const newTitle2 = pathname.startsWith("/team")
		// 	? { title: "Team", icon: <Users2 /> }
		// 	: pathname.startsWith("/account")
		// 	? { title: "Account", icon: <User2 /> }
		// 	: nav[selected.page].parentTitle
		// 	? {
		// 			icon: nav[selected.page].parentIcon,
		// 			title: nav[selected.page].parentTitle,
		// 	  }
		// 	: titleInit;

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

			{/* {pathname === "/team" && (
				<div>
					<Button
						variant="primary"
						className="m-auto"
						href={`${pathname}?action=add&formId=${FORMS.userAdd}`}
					>
						add
					</Button>
				</div>
			)} */}

			{/* {
				<>
					{selected.n && (
						<div className="flex justify-between w-full md:flex-col md:justify-start md:w-fit text-left">
							<p className="text-xs text-text-muted font-bold md:p-1 m-0 text-balance">
								created: <br />
								{selected
									? new Date(selected.n.createdAt).toLocaleString()
									: " - "}
							</p>

							<p className="text-right md:text-left text-text-muted text-xs text-balance md:p-1 m-0">
								last updated: <br />
								{selected
									? new Date(selected.n.updatedAt).toLocaleString()
									: " - "}
							</p>
						</div>
					)}

					<div className="flex flex-nowrap justify-end gap-3 col-start-3">
						{!showForm && noteId && (
							<>
								<Button
									onClick={() => {
										// setShowForm((prev) => ({ ...prev, form: FORMS.n }));
										navigate(`${pathname}?action=edit&formId=${FORMS.n}`, {
											state: { from: pathname },
										});
									}}
								>
									✏️ edit
								</Button>
								<Button>🗑️ delete</Button>
							</>
						)}
						{showForm && (
							<>
								<Button
									// onClick={() => {
									// 	// navigate(location.state?.from ?? "/", {
									// 	// 	replace: true,
									// 	// });
									// 	navigate(pathname, {
									// 		replace: true,
									// 	});
									// }}
									onClick={() => {
										const from = location.state?.from;
										// console.log("FROM: ", from);
										// console.log("path: ", pathname);
										// if (from && from !== pathname && from !== "/") {
										// 	console.log(1);
										// 	// Go back to where we came from
										// 	navigate(from, { replace: true });
										// } else
										if (!from) {
											navigate("/");
										} else {
											navigate(-1);
										}
									}}
								>
									❌ cancel
								</Button>
								<Button type="submit" form={formId} variant="primary">
									save
								</Button>
							</>
						)}
					</div>
				</>
			} */}
		</div>
	);
};

export default Toolbar;
