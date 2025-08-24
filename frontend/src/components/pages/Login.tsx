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
		<div className="flex flex-col justify-center items-center h-full w-full">
			<h2 className="text-3xl p-3">Login</h2>
			{login && (
				<form
					onSubmit={handleSubmit}
					className="card flex flex-col gap-4 items-center justify-center w-full max-w-[500px]"
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
						/>
					</div>

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
						/>
					</div>
					{error && (
						<p role="alert" className="text-red-500">
							{error}
						</p>
					)}

					<div className="flex gap-2 self-end p-3">
						<button type="submit" disabled={isLoading}>
							Submit
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default Login;
