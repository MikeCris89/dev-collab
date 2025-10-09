import { useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateProject } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");

	const { mutateAsync: addProject, isPending, error } = useCreateProject();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title) throw new Error("Title is required");

		const resp = await addProject({ title });

		navigate(`/p/${resp.id}`, { replace: true });
	};

	return (
		<form id="project-form" className="form" onSubmit={handleSubmit}>
			<h2>Create New Project</h2>
			<InputWrapper htmlFor="title" label="Title">
				<input
					name="title"
					id="title"
					required
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isPending}
					className="w-[250px]"
				/>
			</InputWrapper>
		</form>
	);
};

export default ProjectForm;
