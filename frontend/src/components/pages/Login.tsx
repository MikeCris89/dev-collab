import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
	const [username, setUsername] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);

	const { isLoading, login, error } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (username && password && login) {
			await login(username, password);
		}
	};

	return (
		<div className="flex justify-center items-center h-full w-full">
			<h1>Login</h1>
			{login && (
				<form
					onSubmit={handleSubmit}
					className="flex flex-col items-center justify-center rounded ring-1 ring-neutral-300 p-4 "
				>
					<label htmlFor="username">Username</label>
					<input
						name="username"
						id="username"
						required
						onChange={(e) => setUsername(e.target.value)}
						disabled={isLoading}
					/>

					<label htmlFor="password">Password</label>
					<input
						name="password"
						id="password"
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
						disabled={isLoading}
					/>

					<div className="flex gap-2 self-end">
						<button type="button">Cancel</button>
						<button type="submit" disabled={isLoading}>
							Submit
						</button>
					</div>
				</form>
			)}
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default Login;
