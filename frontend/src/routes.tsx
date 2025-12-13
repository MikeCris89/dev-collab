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
import GlobalProvider from "./context/GlobalContext";
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

	console.log("Private routes user: ", user);

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return (
		<GlobalProvider>
			<Outlet />
		</GlobalProvider>
	);
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
					// { path: "p/new", element: <ProjectForm /> },
					{ path: "p/", element: <NoneSelected /> },
					{ path: "p/:projectId", element: <NoneSelected /> },
					// { path: "p/:projectId/edit", element: <ProjectForm /> },
					// { path: "p/:projectId/f/new", element: <FolderForm /> },
					{ path: "p/:projectId/f", element: <NoneSelected /> },
					{ path: "p/:projectId/f/:folderId", element: <NoneSelected /> },
					// { path: "p/:projectId/f/:folderId/edit", element: <></> },
					// {
					// 	path: "p/:projectId/f/:folderId/n/new",
					// 	element: <NoteForm />,
					// },
					{
						path: "p/:projectId/f/:folderId/n",
						element: <NoneSelected />,
					},
					{
						path: "p/:projectId/f/:folderId/n/:noteId",
						element: <NotePreview />,
					},
					// {
					// 	path: "p/:projectId/f/:folderId/n/:noteId/edit",
					// 	element: <NoteForm />,
					// },
					{ path: "account", element: <Account /> },
					{
						path: "team",
						element: <TeamPage />,
					},
					// { path: "team/new", element: <UserAddForm /> },
					// { path: "team/:userId/edit", element: <UserAddForm /> },

					{ path: "*", element: <NotFound /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);
