import { useState } from "react";
import InputWrapper from "./InputWrapper";

const FolderForm = () => {
	const [title, setTitle] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title) {
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
					disabled={}
					autoComplete="off"
					className="w-[250px]"
					required
				/>
			</InputWrapper>
		</form>
	);
};

export default FolderForm;
