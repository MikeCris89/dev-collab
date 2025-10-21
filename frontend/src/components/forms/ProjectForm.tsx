import { useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamMembers, useTeamProject } from "@/hooks/useTeam";
import Loading from "../Loading";
import useRequireAuth from "@/hooks/useRequireAuth";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useGlobal } from "@/context/GlobalContext";
import type { Project } from "@shared/contract";

const ProjectForm = () => {
	const { projectId } = useParams();
	const {
		data: existing,
		isLoading: loadingProject,
		error: errProject,
	} = useTeamProject(projectId || null);

	const [title, setTitle] = useState(existing?.title || "");

	const navigate = useNavigate();
	const { user } = useRequireAuth();
	const { setSelected } = useGlobal();
	const [action] = useGetSearchParams(["action"]);
	const isEdit = action === "edit";

	const { data: members } = useTeamMembers();
	const {
		mutateAsync: addProject,
		isPending: pendingAdd,
		error: errAdd,
	} = useCreateProject();
	const {
		mutateAsync: editProject,
		isPending: pendingEdit,
		error: errEdit,
	} = useUpdateProject();

	const isDirty = existing?.title
		? existing.title !== title.trim()
		: title.trim() !== "";

	const allowNav = useUnsavedChanges(isDirty);

	const isLoading = pendingAdd || pendingEdit || loadingProject;
	const error = errEdit || errProject || errAdd;

	if (isEdit && !projectId)
		throw new Error("ProjectForm: Missing projectId param");
	if (isLoading) return <Loading />;
	if (error) throw new Error(error.message);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title) throw new Error("Title is required");

		allowNav();

		let resp: Project;
		if (isEdit) {
			if (!existing)
				throw new Error("ProjectForm Edit Action - Missing Existing Data");
			resp = await editProject({ data: { title }, id: existing.id });
		} else {
			resp = await addProject({ data: { title } });
		}
		setSelected((prev) => ({ ...prev, p: resp.id, f: null, n: null }));
		navigate(`/`, { replace: true });
	};

	return (
		<form id="project-form" className="form" onSubmit={handleSubmit}>
			<h1>{isEdit ? "Edit" : "Create New"} Project</h1>
			<InputWrapper htmlFor="title" label="Title">
				<input
					name="title"
					id="title"
					required
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isLoading}
					className="w-[250px]"
				/>
			</InputWrapper>

			<h2>Team Access</h2>
			{/* {filteredMembers.length === 0 && <p>No Team Members</p>} */}
			{members
				?.filter((m) => m.id !== user.sub)
				.map((m) => {
					return (
						<div key={m.id}>
							<p>{m.name ?? m.username}</p>
						</div>
					);
				})}
		</form>
	);
};

export default ProjectForm;
