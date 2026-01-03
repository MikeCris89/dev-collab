import {
	useCreateTeamMember,
	useTeamMembers,
	useTeamProjects,
} from "@/hooks/useTeam";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { LIMITS, type SignupRequest } from "@shared/contract";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputWrapper from "./InputWrapper";
import CheckboxContainer from "./CheckboxContainer";
import { useGlobal } from "@/context/GlobalContext";

const UserAddForm = () => {
	const [userData, setUserData] = useState<SignupRequest>({
		username: "",
		password: "",
		name: "",
	});
	const [projectIds, setProjectIds] = useState<string[]>([]);
	const [err, setErr] = useState<string | null>(null);

	const navigate = useNavigate();
	const { nav, formDirty, setFormDirty } = useGlobal();

	const { data: projects = [] } = useTeamProjects();
	const { data: members = [] } = useTeamMembers();
	const { mutateAsync: addUser, isPending, error } = useCreateTeamMember();

	useEffect(() => {
		const isDirty =
			!!userData.username || !!userData.password || !!userData.name;

		setFormDirty(isDirty);
	}, [userData, setFormDirty]);

	const allowNav = useUnsavedChanges(formDirty);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErr(null);

		const count = members.length;
		if (count >= LIMITS.MAX_USERS_PER_TEAM) {
			allowNav();
			setErr("Max users reached");
			return;
		}

		if (formDirty && userData.username && userData.password) {
			allowNav();
			await addUser({ ...userData, projectIds });
		}
		navigate("/team", { replace: true });
	};

	return (
		<form
			id="user-add-form"
			onSubmit={handleSubmit}
			className="form"
			autoComplete="off"
		>
			<div>
				<h1>Add Team Member</h1>
				{(error || err) && (
					<p className="text-red-500">{error?.message ?? err}</p>
				)}
			</div>
			<div className="flex flex-wrap gap-4 items-start justify-center w-full">
				<div className="flex flex-col gap-2 md:gap-4 shrink-0 overflow-hidden p-4">
					<InputWrapper htmlFor="username" label="Username">
						<input
							name="username"
							id="username"
							value={userData.username}
							onChange={handleChange}
							disabled={isPending}
							autoComplete="off"
							className="w-[250px]"
							required
							maxLength={LIMITS.USERNAME_MAX_LENGTH}
							autoFocus
						/>
					</InputWrapper>

					<InputWrapper htmlFor="password" label="Password">
						<input
							name="password"
							id="password"
							type="password"
							value={userData.password}
							required
							onChange={handleChange}
							disabled={isPending}
							className="w-[250px]"
						/>
					</InputWrapper>

					<InputWrapper htmlFor="name" label="Name">
						<input
							name="name"
							id="name"
							value={userData.name ?? undefined}
							onChange={handleChange}
							disabled={isPending}
							autoComplete="off"
							className="w-[250px]"
							placeholder="(optional)"
							maxLength={LIMITS.USERNAME_MAX_LENGTH}
						/>
					</InputWrapper>
				</div>

				<div className="shrink-0 flex flex-col gap-4">
					<h3 className="text-center">Project Access</h3>

					<CheckboxContainer
						items={projects.map((p) => ({
							label: p.title,
							id: p.id,
						}))}
						state={projectIds}
						setState={setProjectIds}
						noneLabel="No Projects"
						icon={nav.p.icon}
					/>
				</div>
			</div>
		</form>
	);
};

export default UserAddForm;
