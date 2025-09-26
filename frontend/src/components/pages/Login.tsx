import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import ThemeSwitcher from "../ThemeSwitcher";
import UserForm from "../UserForm";
import type { User } from "../../lib/types";

const Login = () => {
	const { isLoading, login, error } = useAuth();

	const handleSubmit = async (
		userData: Partial<User & { password: string }>
	) => {
		const { username, password } = userData;
		if (username && password && login) {
			await login(username, password);
		}
	};

	return (
		<>
			<div className="card">
				<UserForm isLoading={isLoading} />
				{error && (
					<p role="alert" className="text-red-500">
						{error}
					</p>
				)}
			</div>
		</>
	);
};

export default Login;
