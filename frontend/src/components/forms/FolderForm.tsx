import { useEffect, useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateFolder, useEditFolder, useFolder } from "@/hooks/useFolders";
import { useParams } from "react-router-dom";
import { useGlobal } from "@/context/GlobalContext";
import Loading from "../Loading";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { LIMITS, type Folder } from "@shared/contract";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const FolderForm = () => {
	const { setSelected, closeForm } = useGlobal();
	const { projectId, folderId } = useParams();
	const [action] = useGetSearchParams(["action"]);

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

	const isDirty = existing
		? existing.title !== title.trim()
		: title.trim() !== "";

	const allowNav = useUnsavedChanges(isDirty);

	useEffect(() => {
		if (existing) {
			setTitle(existing.title);
		}
	}, [existing]);

	if (!projectId) throw new Error("Project ID Missing.");
	if (isEdit && !folderId) throw new Error("Folder ID Missing.");
	if (isLoading) return <Loading />;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			let resp: Folder;
			allowNav();
			if (isEdit) {
				if (!folderId || !existing) throw new Error("Missing Folder Data.");
				resp = await editFolder({ data: { title }, projectId, folderId });
			} else {
				resp = await addFolder({ data: { title }, projectId });
			}
			setSelected((prev) => ({ ...prev, f: resp.id }));
			closeForm();
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
				/>
			</InputWrapper>
			{error && <p>{error.message}</p>}
		</form>
	);
};

export default FolderForm;
