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
import { useTeam } from "./hooks/useTeam";
import GlobalProvider from "./context/GlobalContext";
import TeamPage from "./components/pages/TeamPage";
import UserAddForm from "./components/forms/UserAddForm";
import ProjectForm from "./components/forms/ProjectForm";
import NoteForm from "./components/forms/NoteForm";
import FolderForm from "./components/forms/FolderForm";
import NoneSelected from "./components/pages/NoneSelected";

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
					{ index: true, element: <NoneSelected /> },
					{ path: "p/new", element: <ProjectForm /> },
					{ path: "p/:projectId", element: <NoneSelected /> },
					{ path: "p/:projectId/edit", element: <ProjectForm /> },
					{ path: "p/:projectId/f/new", element: <FolderForm /> },
					{ path: "p/:projectId/f/:folderId", element: <NoneSelected /> },
					{ path: "p/:projectId/f/:folderId/edit", element: <></> },
					{
						path: "p/:projectId/f/:folderId/n/new",
						element: <NoteForm />,
					},
					{
						path: "p/:projectId/f/:folderId/n/:noteId",
						element: <NotePreview />,
					},
					{
						path: "p/:projectId/f/:folderId/n/:noteId/edit",
						element: <NoteForm />,
					},
					{
						path: "team",
						element: <TeamPage />,
					},
					{ path: "team/new", element: <UserAddForm /> },
					{ path: "team/:userId/edit", element: <UserAddForm /> },
					{ path: "*", element: <NotFound /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);
