import { useEffect, useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamProject } from "@/hooks/useTeam";
import Loading from "../Loading";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useGlobal } from "@/context/GlobalContext";
import { LIMITS, type Project } from "@shared/contract";
import MemberCheckList from "./MemberCheckList";

const ProjectForm = () => {
	const { setSelected, closeForm } = useGlobal();
	const { projectId } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [userIds, setUserIds] = useState<string[]>([]);

	const [action] = useGetSearchParams(["action"]);
	const isEdit = action === "edit";

	const {
		data: existing,
		isLoading: loadingProject,
		error: errProject,
	} = useTeamProject(projectId || null);

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

	const isDirty = existing
		? existing.title !== title.trim()
		: title.trim() !== "";

	const allowNav = useUnsavedChanges(isDirty);

	useEffect(() => {
		if (existing) {
			setTitle(existing.title);
			setUserIds([...existing.projectsUsers]);
		}
	}, [existing]);

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
			resp = await editProject({ data: { title, userIds }, id: existing.id });
			setSelected((prev) => ({ ...prev, p: resp.id, f: null, n: null }));
			closeForm();
		} else {
			resp = await addProject({ data: { title, userIds } });
			setSelected((prev) => ({ ...prev, p: resp.id, f: null, n: null }));
			navigate("/", { replace: true });
		}
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
					maxLength={LIMITS.TITLE_MAX_LENGTH}
				/>
			</InputWrapper>

			<h2>Team Access</h2>
			<MemberCheckList userIds={userIds} setUserIds={setUserIds} />
		</form>
	);
};

export default ProjectForm;
