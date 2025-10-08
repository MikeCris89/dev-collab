import {
	createBrowserRouter,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import NotePreview from "./components/pages/NotePreview";
import SelectNote from "./components/pages/SelectNote";
import NotFound from "./components/pages/NotFound";
import { useAuth } from "./context/AuthContext";
import PublicHome from "./components/pages/PublicHome";
import Signup from "./components/pages/Signup";
import { useTeam } from "./hooks/useTeam";
import GlobalProvider from "./context/GlobalContext";
import TeamPage from "./components/pages/TeamPage";
import UserEditForm from "./components/forms/UserEditForm";
import UserAddForm from "./components/forms/UserAddForm";

const PublicRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (user) {
		return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
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

	useTeam();

	return (
		<GlobalProvider>
			<Outlet />
		</GlobalProvider>
	);
};

export const router = createBrowserRouter([
	{
		element: <PublicRoutes />,
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/signup", element: <Signup /> },
		],
	},
	{
		element: <PrivateRoutes />,
		children: [
			{
				path: "/",
				element: <Home />,
				children: [
					{ index: true, element: <SelectNote /> },
					{ path: "p/:projectId" },
					{ path: "p/:projectId/f/:folderId" },
					{
						path: "p/:projectId/f/:folderId/n/:noteId",
						element: <NotePreview />,
					},
					{
						path: "team",
						element: <TeamPage />,
					},
					{ path: "team/new", element: <UserAddForm /> },
					{ path: "*", element: <NotFound /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);
