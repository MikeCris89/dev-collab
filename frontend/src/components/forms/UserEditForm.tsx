import { useGlobal } from "@/context/GlobalContext";
import {
	PasswordModalProvider,
	usePasswordModal,
} from "@/context/PasswordModal";
import {
	useDeleteTeamMember,
	useEditTeamMember,
	useTeamMember,
	useTeamProjects,
} from "@/hooks/useTeam";
import {
	ROLES,
	type EditUser,
	type ProjectWithUsers,
	type UserWithProjects,
} from "@shared/contract";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../Loading";
import Button from "../Button";
import CheckboxContainer from "./CheckboxContainer";
import FormInput from "./FormInput";
import { arraysEqual } from "@/lib/utils";
import useRequireAuth from "@/hooks/useRequireAuth";
import LoadingSpinner from "../LoadingSpinner";
import { useDeleteModal } from "@/context/DeleteModalContext";

interface ContentProps {
	existing: UserWithProjects;
	isPending: boolean;
	error: Error | null;
	formData: EditUser;
	setFormData: React.Dispatch<React.SetStateAction<EditUser>>;
	projectIds: string[];
	setProjectIds: React.Dispatch<React.SetStateAction<string[]>>;
	projects: ProjectWithUsers[];
	isAdmin: boolean;
	submitHandler: (e: React.FormEvent) => void;
}

const UserEditFormContent = ({
	existing,
	isPending,
	error,
	formData,
	setFormData,
	projectIds,
	setProjectIds,
	projects,
	isAdmin,
	submitHandler,
}: ContentProps) => {
	const { setShowModal, setUserId } = usePasswordModal();
	const { user } = useRequireAuth();
	const { setShowModal: setShowDeleteModal } = useDeleteModal();
	const {
		mutateAsync: deleteUser,
		isPending: isDeleting,
		error: deleteError,
	} = useDeleteTeamMember();

	const { nav } = useGlobal();

	const handleDelete = async () => {
		const resp = await deleteUser(existing.id);
	};

	const deleteModal = {
		type: "User",
		name: "",
		onConfirm: handleDelete,
	};

	if (deleteError) console.log(deleteError);

	return (
		<form onSubmit={submitHandler} id="user-edit-form" className="form">
			<div className="text-center w-full">
				<h1 className="mb-1">Edit Team Member</h1>
				<p className="text-text-muted text-sm">{existing.username}</p>
			</div>

			<div className="flex flex-wrap gap-4 justify-center items-start">
				<div className="max-w-sm flex flex-col gap-4 flex-1">
					<span className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border-light pb-1 w-full">
						Profile
					</span>
					<FormInput
						id="name"
						label="Name"
						value={formData.name ?? ""}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						required
						autoFocus
						disabled={isPending}
						className="w-full max-w-[250px]"
						placeholder="(optional)"
					/>
					{(user.isAdmin || existing.id === user.sub) && (
						<div className="flex flex-col gap-1 w-full max-w-[250px] mx-auto">
							<label className="text-sm text-text-muted self-start">
								Password
							</label>
							<Button
								onClick={() => {
									setUserId(existing.id);
									setShowModal(true);
								}}
							>
								Change Password
							</Button>
						</div>
					)}
					{/* {user.isAdmin && !isAdmin && (
						<div className="hidden md:block">
							<DeleteUser />
						</div>
					)} */}
				</div>

				{user.isAdmin && !isAdmin && (
					<div className="max-w-sm flex flex-col gap-5 shrink-0 px-6 flex-1">
						<span className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border-light pb-1 w-full">
							Project Access
						</span>
						<CheckboxContainer
							items={projects.map((p) => ({ label: p.title, id: p.id }))}
							state={projectIds}
							setState={setProjectIds}
							noneLabel="No Projects"
							icon={nav.p.icon}
						/>
					</div>
				)}
			</div>
			{user.isAdmin && !isAdmin && (
				<div className="flex flex-col gap-1 w-full max-w-[250px] mx-auto py-4">
					{/* <label className="text-sm text-text-muted self-start">
						Remove Team Member
					</label> */}
					<Button
						className="bg-red-500 hover:bg-red-500/80"
						onClick={() => setShowDeleteModal(deleteModal)}
						disabled={isPending}
					>
						Delete User
					</Button>
				</div>
			)}

			{error && (
				<p className="text-red-500 text-sm">
					{error.message ?? "Error has occurred"}
				</p>
			)}
		</form>
	);
};

const UserEditForm = () => {
	const [searchParams] = useSearchParams();
	const memberId = searchParams.get("memberId");
	const { formDirty, setFormDirty } = useGlobal();
	const navigate = useNavigate();
	const location = useLocation();

	const { data: existing, isLoading } = useTeamMember(memberId);
	const { data: projects = [], isLoading: loadingProjects } = useTeamProjects();
	const { isPending, error, mutate: editUser } = useEditTeamMember();

	const [formData, setFormData] = useState<EditUser>({
		name: existing?.name || "",
	});
	const [projectIds, setProjectIds] = useState<string[]>(
		existing?.projectsUsers || [],
	);

	useEffect(() => {
		if (existing) {
			setFormData({ name: existing.name });
			setProjectIds([...(existing.projectsUsers ?? [])]);
		}
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

	const isAdmin = existing.role === ROLES.admin;

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formDirty) return;
		editUser({ id: existing.id, data: { ...formData, projectIds } });
		const from = location.state?.from;
		if (!from) navigate("/team", { replace: true });
		else navigate(-1);
	};

	return (
		<PasswordModalProvider>
			<UserEditFormContent
				existing={existing}
				isPending={isPending}
				error={error}
				formData={formData}
				setFormData={setFormData}
				projectIds={projectIds}
				setProjectIds={setProjectIds}
				projects={projects}
				isAdmin={isAdmin}
				submitHandler={submitHandler}
			/>
		</PasswordModalProvider>
	);
};

export default UserEditForm;
