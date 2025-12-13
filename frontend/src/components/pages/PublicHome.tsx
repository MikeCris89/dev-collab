import { Link, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import Button from "../Button";
import { ArrowRight } from "lucide-react";

const PublicHome = () => {
	const { error } = useAuth();
	const { pathname } = useLocation();

	const isLogin = pathname.includes("login");

	return (
		<div className="flex flex-col justify-center items-center h-full w-full relative max-w-[90%] m-auto">
			<div className="absolute top-0 right-0  h-10 w-10 p-6">
				<ThemeSwitcher />
			</div>

			<h1 className="p-3">DevCollab</h1>

			<div className="card flex flex-col gap-2 w-[500px] max-w-[90%]">
				<div className="flex justify-between px-4 items-center">
					<h2>{isLogin ? "Login" : "Sign Up"}</h2>
					{/* <Link to={isLogin ? "/signup" : "/login"} className="">
						{isLogin ? "Sign Up" : "Login"}
					</Link> */}
					<Button
						href={isLogin ? "/signup" : "/login"}
						className="flex gap-2 items-center"
						replace
					>
						{isLogin ? "Sign Up" : "Login"} <ArrowRight size={16} />
					</Button>
				</div>

				<Outlet />

				{error && (
					<p role="alert" className="text-red-500">
						{error}
					</p>
				)}
			</div>
		</div>
	);
};

export default PublicHome;
