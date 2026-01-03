import { useEffect, useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateFolder, useEditFolder, useFolder } from "@/hooks/useFolders";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "@/context/GlobalContext";
import Loading from "../Loading";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { LIMITS, type Folder } from "@shared/contract";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const FolderForm = () => {
	const { setSelected, closeForm, setFormDirty, formDirty } = useGlobal();
	const { projectId, folderId } = useParams();
	const [action] = useGetSearchParams(["action"]);
	const navigate = useNavigate();

	const isEdit = action === "edit";

	const [title, setTitle] = useState("");

	const {
		mutateAsync: addFolder,
		isPending: pendingAdd,
		error: errAdd,
	} = useCreateFolder();

	const {
		mutateAsync: editFolder,
		isPending: pendingEdit,
		error: errEdit,
	} = useEditFolder();

	const { data: existing, isLoading } = useFolder({ projectId, folderId });

	const allowNav = useUnsavedChanges(formDirty);

	useEffect(() => {
		if (existing) {
			setTitle(existing.title);
		}
	}, [existing]);

	useEffect(() => {
		const isDirty = existing
			? existing.title !== title.trim()
			: title.trim() !== "";

		setFormDirty(isDirty);
	}, [title, setFormDirty, existing]);

	if (isLoading) return <Loading />;
	if (!projectId) throw new Error("Project ID Missing.");
	if (isEdit && !folderId) throw new Error("Folder ID Missing.");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			let resp: Folder;
			allowNav();
			if (isEdit) {
				if (!folderId || !existing) throw new Error("Missing Folder Data.");
				resp = await editFolder({ data: { title }, projectId, folderId });
				setSelected((prev) => ({ ...prev, f: resp.id }));
				closeForm();
			} else {
				resp = await addFolder({ data: { title }, projectId });
				setSelected((prev) => ({ ...prev, f: resp.id }));
				// navigate(`/p/${projectId}/f/${resp.id}`, { replace: true });
				navigate("/", { replace: true });
			}
		}
	};

	const isPending = pendingAdd || pendingEdit;
	const error = errAdd || errEdit;

	return (
		<form id="folder-form" className="form" onSubmit={handleSubmit}>
			<h1>{isEdit ? "Edit" : "Create New"} Folder</h1>
			<InputWrapper htmlFor="title" label="Title">
				<input
					id="title"
					name="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isPending}
					autoComplete="off"
					className="w-[250px]"
					required
					maxLength={LIMITS.TITLE_MAX_LENGTH}
					autoFocus
				/>
			</InputWrapper>
			{error && <p className="text-red-500">{error.message}</p>}
		</form>
	);
};

export default FolderForm;
