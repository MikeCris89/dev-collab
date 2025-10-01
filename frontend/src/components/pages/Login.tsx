import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "@shared/contract";
import Button from "../Button";
import { Link } from "react-router-dom";

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
				<div className="flex flex-col gap-1">
					<label htmlFor="username" className="self-start">
						Username
					</label>
					<input
						name="username"
						id="username"
						onChange={handleChange}
						className="w-[250px]"
						disabled={isLoading}
						autoComplete="off"
						required
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
						onChange={handleChange}
						className="w-[250px]"
						disabled={isLoading}
						required
					/>
				</div>

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
