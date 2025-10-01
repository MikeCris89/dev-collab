import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";

const PublicHome = () => {
	const { error } = useAuth();
	const { pathname } = useLocation();

	const isLogin = pathname.includes("login");
	console.log(pathname);

	return (
		<div className="flex flex-col justify-center items-center h-full w-full relative max-w-[90%] m-auto">
			<div className="absolute top-0 right-0  h-10 w-10 p-6">
				<ThemeSwitcher />
			</div>

			<h1 className="p-3">DevCollab</h1>

			<div className="card flex flex-col gap-2 w-[500px] max-w-[90%]">
				<div className="flex justify-between px-4 items-center">
					<h2>{isLogin ? "Login" : "Sign Up"}</h2>
					<Link to={isLogin ? "/signup" : "/login"} className="">
						{isLogin ? "Sign Up" : "Login"}
					</Link>
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
