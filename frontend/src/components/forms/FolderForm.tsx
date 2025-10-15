import { useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateFolder } from "@/hooks/useFolders";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "@/context/GlobalContext";

const FolderForm = () => {
	const { setSelected, closeForm } = useGlobal();
	const [title, setTitle] = useState("");
	const { projectId } = useParams();
	const navigate = useNavigate();

	if (!projectId) throw new Error("Something went wrong.");

	const { mutateAsync: addFolder, isPending, error } = useCreateFolder();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title) {
			const resp = await addFolder({ title, projectId });
			console.log(resp);
			setSelected((prev) => ({ ...prev, f: resp.id }));
			closeForm();
			navigate("/");
		}
	};

	return (
		<form id="folder-form" className="form" onSubmit={handleSubmit}>
			<h1>Create New Folder</h1>
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
				/>
			</InputWrapper>
			{error && <p>{error.message}</p>}
		</form>
	);
};

export default FolderForm;
