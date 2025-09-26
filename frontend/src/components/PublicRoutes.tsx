import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";

const PublicRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (user) {
		return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
	}

	return (
		<div className="flex flex-col justify-center items-center h-full w-full relative max-w-[90%] m-auto">
			<div className="absolute top-0 right-0  h-10 w-10 p-6">
				<ThemeSwitcher />
			</div>
			<h1 className="p-3">
				DevCollab {location.pathname.includes("signup") ? "Sign Up" : "Login"}
			</h1>
			<Outlet />
		</div>
	);
};

export default PublicRoutes;
