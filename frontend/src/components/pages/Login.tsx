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
	const { isLoading, login, demo, setError } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (userData.username && userData.password) login(userData);
		else setError("Username and Password required.");
	};

	return (
		<>
			<Button
				variant="primary"
				disabled={isLoading}
				onClick={() => demo()}
				className="w-full max-w-[250px] mx-auto"
			>
				{isLoading ? <LoadingSpinner /> : "Try a demo account"}
			</Button>

			<div className="flex items-center gap-3 my-4">
				<span className="h-px flex-1 bg-border-light" />
				<span className="text-text-muted text-xs">or</span>
				<span className="h-px flex-1 bg-border-light" />
			</div>

			<form
				id="user-form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-3 w-full pb-2"
				autoComplete="off"
			>
				<FormInput
					id="username"
					label="Username"
					value={userData.username}
					onChange={(e) =>
						setUserData((prev) => ({ ...prev, username: e.target.value }))
					}
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
					onChange={(e) =>
						setUserData((prev) => ({ ...prev, password: e.target.value }))
					}
					disabled={isLoading}
					required
				/>

				<Button
					type="submit"
					disabled={isLoading || !userData.password || !userData.username}
					variant="primary"
					className="w-full max-w-[250px] mx-auto mt-2"
				>
					{isLoading ? <LoadingSpinner /> : "Sign In"}
				</Button>
			</form>
		</>
	);
};

export default Login;
