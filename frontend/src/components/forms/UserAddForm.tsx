import { useGlobal } from "@/context/GlobalContext";
import { useCreateTeamMember, useTeamProjects } from "@/hooks/useTeam";
import useRequireAuth from "@/hooks/useRequireAuth";
import type { SignupRequest } from "@shared/contract";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import CheckboxContainer from "./CheckboxContainer";
import FormInput from "./FormInput";
import PasswordFields from "./PasswordFields";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserAddForm = () => {
	const { isAdmin, user } = useRequireAuth();
	const navigate = useNavigate();
	const { nav } = useGlobal();

	const { data: projects = [], isLoading: loadingProjects } = useTeamProjects();
	const { isPending, error, mutate: createUser } = useCreateTeamMember();

	const [formData, setFormData] = useState<SignupRequest>({
		username: "",
		password: "",
		name: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [projectIds, setProjectIds] = useState<string[]>([]);

	if (!isAdmin) {
		navigate("/team", { replace: true });
		return null;
	}

	const usernameIsEmail = EMAIL_REGEX.test(formData.username.trim());
	const canSubmit =
		!isPending &&
		!loadingProjects &&
		formData.username.trim().length > 0 &&
		formData.password.length > 0 &&
		confirmPassword.length > 0 &&
		!usernameIsEmail;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}
		if (!canSubmit) return;
		createUser(
			{ ...formData, teamId: user.teamId, projectIds },
			{ onSuccess: () => navigate("/team", { replace: true }) },
		);
	};

	return (
		<form onSubmit={handleSubmit} id="user-add-form" className="form">
			<div className="text-center w-full">
				<h1 className="mb-1">Add Team Member</h1>
			</div>

			<div className="w-full max-w-sm flex flex-col gap-5">
				<span className="text-xs font-semibold uppercase tracking-widest text-text-muted border-b border-border-light pb-1 w-full">
					Credentials
				</span>
				<div className="flex flex-col gap-1">
					<FormInput
						id="username"
						label="Username"
						value={formData.username}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, username: e.target.value }))
						}
						required
						autoFocus
						disabled={isPending}
					/>
					{usernameIsEmail ? (
						<p className="text-red-500 text-xs">
							Please use a username, not an email address.
						</p>
					) : (
						<p className="text-text-muted text-xs">
							Use a username, not an email address.
						</p>
					)}
				</div>
				<PasswordFields
					password={formData.password}
					confirmPassword={confirmPassword}
					onPasswordChange={(val) => {
						setFormData((prev) => ({ ...prev, password: val }));
						setPasswordError(null);
					}}
					onConfirmChange={(val) => {
						setConfirmPassword(val);
						setPasswordError(null);
					}}
					error={passwordError}
					disabled={isPending}
					direction="row"
				/>
				<FormInput
					id="name"
					label="Name"
					value={formData.name ?? ""}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, name: e.target.value }))
					}
					placeholder="(optional)"
					disabled={isPending}
				/>
			</div>

			<div className="w-full max-w-sm flex flex-col gap-5 shrink-0">
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

			{error && (
				<p className="text-red-500 text-sm">
					{error.message ?? "Error has occurred"}
				</p>
			)}

			<div className="flex gap-2 p-3">
				<Button type="submit" disabled={!canSubmit} variant="primary">
					Add Member
				</Button>
			</div>
		</form>
	);
};

export default UserAddForm;
