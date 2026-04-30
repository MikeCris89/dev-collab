import { useEffect, useState } from "react";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamMembers, useTeamProject } from "@/hooks/useTeam";
import Loading from "../Loading";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useGlobal } from "@/context/GlobalContext";
import { LIMITS, type Project } from "@shared/contract";
import CheckboxContainer from "./CheckboxContainer";
import FormInput from "./FormInput";
import useRequireAuth from "@/hooks/useRequireAuth";
import { arraysEqual } from "@/lib/utils";

const ProjectForm = () => {
	const { user } = useRequireAuth();
	const { setSelected, closeForm, formDirty, setFormDirty } = useGlobal();
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

	const { data: members = [] } = useTeamMembers();

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

	useEffect(() => {
		const isDirty = existing
			? existing.title.trim() !== title.trim() ||
			  !arraysEqual(userIds, existing.projectsUsers)
			: title.trim() !== "";

		setFormDirty(isDirty);
	}, [title, existing, setFormDirty, userIds]);

	const allowNav = useUnsavedChanges(formDirty);

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
			<div className="text-center w-full">
				<h1>{isEdit ? "Edit Project" : "New Project"}</h1>
			</div>

			<div className="w-full max-w-sm flex flex-col gap-5">
				<span className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border-light pb-1 w-full">
					Details
				</span>
				<FormInput
					id="title"
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isLoading}
					required
					maxLength={LIMITS.TITLE_MAX_LENGTH}
					autoFocus
				/>
			</div>

			<div className="w-full max-w-sm flex flex-col gap-5 shrink-0">
				<span className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border-light pb-1 w-full">
					Team Access
				</span>
				<CheckboxContainer
					items={members
						.filter((m) => m.id !== user.sub)
						.map((m) => ({ label: m.name || m.username, id: m.id }))}
					state={userIds}
					setState={setUserIds}
					noneLabel="No Team Members"
					avatarIcon
				/>
			</div>
		</form>
	);
};

export default ProjectForm;
