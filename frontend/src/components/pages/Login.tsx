import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "@shared/contract";
import Button from "../Button";
import FormInput from "../forms/FormInput";
import LoadingSpinner from "../LoadingSpinner";

const Login = () => {
	const [userData, setUserData] = useState<LoginRequest>({
		username: "",
		password: "",
	});
	const { isLoading, login, setError } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.username && userData.password) login(userData);
		else setError("Username and Password required.");
	};

	return (
		<form
			id="user-form"
			onSubmit={handleSubmit}
			className="flex flex-col gap-3 w-full"
			autoComplete="off"
		>
			<FormInput
				id="username"
				label="Username"
				value={userData.username}
				onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}
				disabled={isLoading}
				autoFocus
				required
			/>

			{/* // TODO generate random passwords instead, do not let users create their own passwords */}

			<FormInput
				id="password"
				label="Password"
				type="password"
				value={userData.password}
				onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
				disabled={isLoading}
				required
			/>

			<Button
				type="submit"
				disabled={isLoading}
				variant="primary"
				className="w-full mt-2"
			>
				{isLoading ? <LoadingSpinner /> : "Sign In"}
			</Button>
		</form>
	);
};

export default Login;
