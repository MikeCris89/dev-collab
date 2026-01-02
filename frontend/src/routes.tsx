import {
	createBrowserRouter,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import NotePreview from "./components/pages/NotePreview";
import NotFound from "./components/pages/NotFound";
import { useAuth } from "./context/AuthContext";
import PublicHome from "./components/pages/PublicHome";
import Signup from "./components/pages/Signup";
import TeamPage from "./components/pages/TeamPage";
import NoneSelected from "./components/pages/NoneSelected";
import Account from "./components/pages/Account";
import InnerErrorFallback from "./components/InnerErrorFallback";

const PublicRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (user) {
		return <Navigate to={location.state?.from ?? "/"} replace />;
	}

	return <PublicHome />;
};

export default PublicRoutes;

const PrivateRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
};

export const router = createBrowserRouter([
	{
		element: <PublicRoutes />,
		errorElement: <InnerErrorFallback />,
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/signup", element: <Signup /> },
		],
	},
	{
		element: <PrivateRoutes />,
		errorElement: <InnerErrorFallback />,
		children: [
			{
				path: "/",
				element: <Home />,
				errorElement: <InnerErrorFallback />,
				children: [
					{ index: true, element: <NoneSelected /> },
					{ path: "p/", element: <NoneSelected /> },
					{ path: "p/:projectId", element: <NoneSelected /> },
					{ path: "p/:projectId/f", element: <NoneSelected /> },
					{ path: "p/:projectId/f/:folderId", element: <NoneSelected /> },
					{
						path: "p/:projectId/f/:folderId/n",
						element: <NoneSelected />,
					},
					{
						path: "p/:projectId/f/:folderId/n/:noteId",
						element: <NotePreview />,
					},
					{ path: "account", element: <Account /> },
					{
						path: "team",
						element: <TeamPage />,
					},
					{ path: "*", element: <NotFound /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);
