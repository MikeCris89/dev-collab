import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import ThemeSwitcher from "../ThemeSwitcher";

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
		<div className="flex flex-col justify-center items-center h-full w-full relative max-w-[90%] m-auto">
			<div className="absolute top-0 right-0  h-10 w-10 p-6">
				<ThemeSwitcher />
			</div>
			<h1 className="p-3">MyNotes Login</h1>

			<form
				onSubmit={handleSubmit}
				className="card flex flex-col gap-4 items-center justify-center w-full max-w-[500px] "
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
				{error && (
					<p role="alert" className="text-red-500">
						{error}
					</p>
				)}

				<div className="flex gap-2 self-end p-3">
					<Button type="submit" disabled={isLoading} variant="primary">
						Submit
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Login;
