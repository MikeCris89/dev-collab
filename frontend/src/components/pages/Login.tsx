import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "@shared/contract";
import Button from "../Button";
import InputWrapper from "../forms/InputWrapper";

const Login = () => {
	const [userData, setUserData] = useState<LoginRequest>({
		username: "",
		password: "",
	});
	const { isLoading, login, setError } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.username && userData.password) login(userData);
		else setError("Username and Password required.");
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
						value={userData.username}
						onChange={handleChange}
						className="w-[250px]"
						disabled={isLoading}
						autoComplete="off"
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
						onChange={handleChange}
						className="w-[250px]"
						disabled={isLoading}
						required
					/>
				</InputWrapper>

				<Button
					type="submit"
					disabled={isLoading}
					variant="primary"
					className="w-[150px]"
				>
					Submit
				</Button>
			</form>
		</>
	);
};

export default Login;
