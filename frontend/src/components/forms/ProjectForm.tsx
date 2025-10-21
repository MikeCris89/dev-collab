import { useMemo, useState } from "react";
import InputWrapper from "./InputWrapper";
import { useCreateProject } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { useTeamMembers } from "@/hooks/useTeam";
import Loading from "../Loading";
import useRequireAuth from "@/hooks/useRequireAuth";

const ProjectForm = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const { user } = useRequireAuth();

	const { data: members, isLoading, error: errMembers } = useTeamMembers();

	const { mutateAsync: addProject, isPending, error } = useCreateProject();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title) throw new Error("Title is required");

		const resp = await addProject({ data: { title } });

		navigate(`/p/${resp.id}`, { replace: true });
	};

	// const filteredMembers = useMemo(
	// 	() => members?.filter((m) => m.id !== user.sub) ?? [],
	// 	[members, user.sub]
	// );

	if (isLoading) return <Loading />;
	if (error) throw new Error(error.message);
	if (!members || errMembers)
		throw new Error(errMembers?.message ?? "Failed to load members");

	return (
		<form id="project-form" className="form" onSubmit={handleSubmit}>
			<h1>Create New Project</h1>
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

			<h2>Team Access</h2>
			{/* {filteredMembers.length === 0 && <p>No Team Members</p>} */}
			{members.map((m) => {
				if (m.id === user.sub) {
					return;
				}
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
