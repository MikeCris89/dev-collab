import { Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import Button from "../Button";
import { ArrowRight } from "lucide-react";

const PublicHome = () => {
	const { error, cookieBlocked } = useAuth();
	const { pathname } = useLocation();

	const isLogin = pathname.includes("login");

	return (
		<div className="flex flex-col justify-start pt-[50px] md:pt-[100px] xl:pt-[150px] items-center h-screen w-full relative overflow-y-auto min-h-0">
			<div>
				<div className="absolute top-4 right-4">
					<ThemeSwitcher />
				</div>

				<div className="flex flex-col items-center gap-1 mb-4">
					<img
						src="devcollab_logo_text.png"
						alt="logo"
						width={200}
						className="md:w-[300px]"
					/>
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

						{cookieBlocked && (
							<div
								role="alert"
								className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400"
							>
								<p className="m-0 font-semibold">Cookies appear to be blocked</p>
								<p className="m-0 mt-1">
									This site uses a cookie to log you in and keep you signed in on
									this browser. An ad blocker or privacy setting is preventing it.
									Please allow cookies for this site (or disable your blocker
									here), then try again.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicHome;
