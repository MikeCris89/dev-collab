import type { SignupRequest } from "@shared/contract";
import Button from "../Button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
	const { isLoading, signup } = useAuth();
	const [userData, setUserData] = useState<SignupRequest>({
		username: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.username) signup(userData);
	};

	return (
		<>
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

				<div className="flex flex-col gap-1">
					<label htmlFor="firstName" className="self-start">
						First Name
					</label>
					<input
						name="firstName"
						id="firstName"
						required
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
						placeholder="(optional)"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="lastName" className="self-start">
						Last Name
					</label>
					<input
						name="lastName"
						id="lastName"
						required
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
						placeholder="(optional)"
					/>
				</div>

				<div className="flex gap-2  p-3">
					<Button type="submit" disabled={isLoading} variant="primary">
						Submit
					</Button>
				</div>
			</form>
		</>
	);
};

export default Signup;
