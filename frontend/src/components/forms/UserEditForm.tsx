import { useGlobal } from "@/context/GlobalContext";
import {
	useEditTeamMember,
	useTeamMember,
	useTeamProjects,
} from "@/hooks/useTeam";
import { ROLES, type EditUser } from "@shared/contract";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../Loading";
import CheckboxContainer from "./CheckboxContainer";
import { arraysEqual } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Button from "../Button";

const UserEditForm = () => {
	const [searchParams] = useSearchParams();
	const memberId = searchParams.get("memberId");
	const { formDirty, setFormDirty, nav } = useGlobal();
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const { data: existing, isLoading } = useTeamMember(memberId);

	const [formData, setFormData] = useState<EditUser>({
		name: existing?.name || "",
	});

	const [projectIds, setProjectIds] = useState<string[]>(
		existing?.projectsUsers || []
	);

	const { data: projects, isLoading: loadingProjects } = useTeamProjects();

	const { isPending, error, mutate: editUser } = useEditTeamMember();

	// initialize data
	useEffect(() => {
		if (existing) {
			setFormData({ name: existing.name });
			setProjectIds([...(existing.projectsUsers ?? [])]);
		}
		setFormDirty(false);
	}, [existing, memberId, setFormDirty]);

	// check if form isDirty
	useEffect(() => {
		const isDirty =
			formData.name !== (existing?.name || "") ||
			!arraysEqual(projectIds, existing?.projectsUsers ?? []);

		setFormDirty(isDirty);
	}, [formData, setFormDirty, existing, projectIds]);

	if (isLoading || loadingProjects) return <Loading />;

	if (!memberId) throw new Error("memberId not provided.");
	if (!existing) throw new Error("Team Member not found.");

	const isAdminUser = user?.role === ROLES.admin;
	const isAdmin = existing.role === ROLES.admin;

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formDirty) return;

		editUser({ id: existing.id, data: { ...formData, projectIds } });
		const from = location.state?.from;

		if (!from) {
			navigate("/team", {
				replace: true,
			});
		} else {
			navigate(-1);
		}
	};

	return (
		<form onSubmit={submitHandler} id="user-edit-form" className="form ">
			<h1 className="w-full text-center">Edit Team Member</h1>
			<Button className="ml-50">change password</Button>
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

			{!isAdmin && (
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
			)}
			{error && (
				<div className="text-red-500 text-sm">
					{error.message ?? "Error has occurred"}
				</div>
			)}
		</form>
	);
};

export default UserEditForm;
