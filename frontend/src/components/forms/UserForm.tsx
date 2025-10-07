import { useState } from "react";
import type { User } from "@shared/contract";
import Button from "../Button";

const UserForm = ({
	existing,
	isLoading,
	onSubmit,
	showSaveBtn = false,
	type,
}: {
	existing: User;
	isLoading: boolean;
	onSubmit: (userData: User) => void;
	showSaveBtn: boolean;
	type: "login" | "signup" | "edit";
}) => {
	const [userData, setUserData] = useState<User>(existing);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.username) onSubmit(userData);
	};

	return (
		<form
			id="user-form"
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 items-center justify-center w-full max-w-[500px] "
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
					disabled={isLoading}
					autoComplete="off"
					className="w-[250px]"
				/>
			</div>

			{/* // TODO generate random passwords instead, do not let users create their own passwords */}
			{type !== "edit" && (
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
						disabled={isLoading}
						className="w-[250px]"
					/>
				</div>
			)}

			{type !== "login" && (
				<div className="flex gap-4 items-center">
					<div className="flex flex-col gap-1">
						<label htmlFor="name" className="self-start">
							Name
						</label>
						<input
							name="name"
							id="name"
							required
							onChange={handleChange}
							disabled={isLoading}
							autoComplete="off"
							className="w-[250px]"
						/>
					</div>
				</div>
			)}

			{showSaveBtn && (
				<div className="flex gap-2 self-end p-3">
					<Button type="submit" disabled={isLoading} variant="primary">
						Submit
					</Button>
				</div>
			)}
		</form>
	);
};

export default UserForm;
