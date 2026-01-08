import { useGlobal } from "@/context/GlobalContext";
import {
	useEditTeamMember,
	useTeamMember,
	useTeamProjects,
} from "@/hooks/useTeam";
import type { EditUser } from "@shared/contract";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../Loading";
import CheckboxContainer from "./CheckboxContainer";
import { arraysEqual } from "@/lib/utils";

const UserEditForm = () => {
	const [searchParams] = useSearchParams();
	const memberId = searchParams.get("memberId");
	const { formDirty, setFormDirty, nav } = useGlobal();

	const { data: existing, isLoading } = useTeamMember(memberId);

	const [formData, setFormData] = useState<EditUser>({
		name: existing?.name || "",
	});

	const [projectIds, setProjectIds] = useState<string[]>(
		existing?.projectsUsers || []
	);

	const { data: projects, isLoading: loadingProjects } = useTeamProjects();

	const { isPending, error, mutate: editUser } = useEditTeamMember();

	useEffect(() => {
		if (existing) setFormData({ name: existing.name });
		setFormDirty(false);
	}, [existing, memberId, setFormDirty]);

	useEffect(() => {
		const isDirty =
			formData.name !== (existing?.name || "") ||
			!arraysEqual(projectIds, existing?.projectsUsers ?? []);

		setFormDirty(isDirty);
	}, [formData, setFormDirty, existing, projectIds]);

	if (isLoading || loadingProjects) return <Loading />;

	if (!memberId) throw new Error("memberId not provided.");
	if (!existing) throw new Error("Team Member not found.");

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formDirty) return;

		editUser({ id: existing.id, data: formData });
	};

	return (
		<form onSubmit={submitHandler} id="user-edit-form" className="form ">
			<h1 className="w-full text-center">Edit Team Member</h1>
			{existing && <h2 className="text-4xl">{existing.username}</h2>}
			<input
				value={formData.name}
				placeholder="name"
				required
				onChange={(e) =>
					setFormData((prev) => ({ ...prev, name: e.target.value }))
				}
				className="text-[28px] text-center max-w-[95%]"
				disabled={isPending}
				autoFocus
			/>
			<div className="shrink-0 flex flex-col gap-4">
				<h3 className="text-center">Project Access</h3>

				<CheckboxContainer
					items={
						projects?.map((p) => ({
							label: p.title,
							id: p.id,
						})) || []
					}
					state={projectIds || []}
					setState={setProjectIds}
					noneLabel="No Projects"
					icon={nav.p.icon}
				/>
			</div>
			{error && (
				<div className="text-red-500 text-sm">
					{error.message ?? "Error has occurred"}
				</div>
			)}
		</form>
	);
};

export default UserEditForm;
