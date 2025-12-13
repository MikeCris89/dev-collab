import type { SignupRequest } from "@shared/contract";
import Button from "../Button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import InputWrapper from "../forms/InputWrapper";

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
		if (userData.username && userData.password) signup(userData);
	};

	return (
		<>
			<form
				id="user-form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 items-center justify-center w-full max-w-[500px] "
				autoComplete="off"
			>
				<InputWrapper htmlFor="username" label="Username">
					<input
						name="username"
						id="username"
						required
						value={userData.username}
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
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
						disabled={isLoading}
						className="w-[250px]"
					/>
				</InputWrapper>

				<InputWrapper htmlFor="name" label="Name">
					<input
						name="name"
						id="name"
						value={userData.name}
						onChange={handleChange}
						disabled={isLoading}
						autoComplete="off"
						className="w-[250px]"
						placeholder="(optional)"
					/>
				</InputWrapper>

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
