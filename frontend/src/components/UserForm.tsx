import { useState } from "react";
import Button from "./Button";
import type { User } from "../lib/types";

const UserForm = ({
	isLoading,
}: {
	isLoading: boolean;
	onSubmit: (userData: Partial<User & { password: string }>) => void;
}) => {
	const [username, setUsername] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);
	const [userData, setUserData] = useState<>();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<form
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
					onChange={(e) => setUsername(e.target.value)}
					disabled={isLoading}
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
					onChange={(e) => setPassword(e.target.value)}
					disabled={isLoading}
					className="w-[250px]"
				/>
			</div>

			<div className="flex gap-2 self-end p-3">
				<Button type="submit" disabled={isLoading} variant="primary">
					Submit
				</Button>
			</div>
		</form>
	);
};

export default UserForm;
