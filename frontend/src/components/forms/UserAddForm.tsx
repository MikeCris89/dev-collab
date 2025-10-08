import { useCreateTeamMember, useTeamMembers } from "@/hooks/useTeam";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { LIMITS, type SignupRequest } from "@shared/contract";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
			<div className="flex flex-col gap-1">
				<label htmlFor="username" className="self-start">
					Username
				</label>
				<input
					name="username"
					id="username"
					required
					onChange={handleChange}
					disabled={isPending}
					autoComplete="off"
					className="w-[250px]"
				/>
			</div>

			{/* // TODO generate random passwords instead, do not let users create their own passwords */}
			<div className="flex flex-col gap-1">
				<label htmlFor="password" className="self-start">
					Password
				</label>
				<input
					name="password"
					id="password"
					type="password"
					required
					onChange={handleChange}
					disabled={isPending}
					className="w-[250px]"
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="name" className="self-start">
					Name
				</label>
				<input
					name="name"
					id="name"
					required
					onChange={handleChange}
					disabled={isPending}
					autoComplete="off"
					className="w-[250px]"
					placeholder="(optional)"
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="projects" className="self-start">
					Projects
				</label>
				<label htmlFor="selectAll" className="self-start">
					select all
				</label>
				<input
					type="checkbox"
					name="selectAll"
					id="selectAll"
					onChange={handleChange}
					disabled={isPending}
					className="w-[250px]"
				/>
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
			</div>
		</form>
	);
};

export default UserAddForm;
