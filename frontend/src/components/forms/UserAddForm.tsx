import { useCreateTeamMember, useTeamMembers } from "@/hooks/useTeam";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { LIMITS, type SignupRequest } from "@shared/contract";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputWrapper from "./InputWrapper";

const UserAddForm = () => {
	const [userData, setUserData] = useState<SignupRequest>({
		username: "",
		password: "",
		name: "",
		projectIds: [],
	});

	const navigate = useNavigate();

	// const { data: projects, isLoading, error } = use;
	const { data: members = [] } = useTeamMembers();
	const { mutateAsync: addUser, isPending, error } = useCreateTeamMember();

	const isDirty = !!userData.username || !!userData.password || !!userData.name;

	useUnsavedChanges(isDirty);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const count = members.length;
			if (count >= LIMITS.MAX_USERS_PER_TEAM)
				throw new Error("Max Users reached");
			if (userData.username && userData.password) await addUser(userData);
			navigate("/team", { replace: true });
		} catch (e) {
			if (e instanceof Error) console.log(e.message);
			else console.log("Error has occured");
		}
	};

	const handleSelectAll = () => {};

	return (
		<form
			id="user-add-form"
			onSubmit={handleSubmit}
			className="form"
			autoComplete="off"
		>
			<h2>Add Team Member</h2>
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
				/>
			</InputWrapper>

			{/* // TODO generate random passwords instead, do not let users create their own passwords */}

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
					required
					value={userData.name}
					onChange={handleChange}
					disabled={isPending}
					autoComplete="off"
					className="w-[250px]"
					placeholder="(optional)"
				/>
			</InputWrapper>

			<InputWrapper htmlFor="projects" label="Projects">
				<InputWrapper
					htmlFor="selectAll"
					label="select all"
					className="flex-row"
				>
					<input
						type="checkbox"
						name="selectAll"
						id="selectAll"
						onChange={handleChange}
						disabled={isPending}
						className="w-[250px]"
					/>
				</InputWrapper>
				{
					<input
						type="checkbox"
						name="projects"
						id="projects"
						onChange={handleChange}
						disabled={isPending}
						className="w-[250px]"
					/>
				}
			</InputWrapper>
		</form>
	);
};

export default UserAddForm;
