import { Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import Button from "../Button";
import { ArrowRight } from "lucide-react";

const PublicHome = () => {
	const { error } = useAuth();
	const { pathname } = useLocation();

	const isLogin = pathname.includes("login");

	return (
		<div className="flex flex-col justify-center items-center h-full w-full relative">
			<div className="absolute top-4 right-4">
				<ThemeSwitcher />
			</div>

			<div className="flex flex-col items-center gap-1 mb-4">
				<h1 className="p-0 m-0">DevCollab</h1>
				<p className="text-text-muted text-sm m-0">
					{isLogin ? "Welcome back." : "Create your account to get started."}
				</p>
			</div>

			<div className="card flex flex-col w-[600px] max-w-[92vw]">
				<div className="flex justify-between px-5 py-3 items-center border-b border-border-light">
					<h2 className="text-xl font-semibold m-0">
						{isLogin ? "Sign In" : "Sign Up"}
					</h2>
					<Button
						href={isLogin ? "/signup" : "/login"}
						className="flex gap-2 items-center text-sm"
						replace
					>
						{isLogin ? "New account" : "Sign in"} <ArrowRight size={14} />
					</Button>
				</div>

				<div className="px-5 py-4">
					<Outlet />

					{error && (
						<p role="alert" className="text-red-500 text-sm mt-2 text-center">
							{error}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PublicHome;
