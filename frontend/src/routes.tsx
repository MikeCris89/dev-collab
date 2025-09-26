import {
	createBrowserRouter,
	Navigate,
	Outlet,
	useLocation,
} from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import NotePreview from "./components/pages/NotePreview";
import SelectNote from "./components/pages/SelectNote";
import NotFound from "./components/pages/NotFound";
import { useAuth } from "./context/AuthContext";
import NotesProvider from "./context/NotesContext";
import PublicRoutes from "./components/PublicRoutes";

const PrivateRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();
	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return (
		<NotesProvider>
			<Outlet />
		</NotesProvider>
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
					{ path: "p/:projectId", element: <></> },
					{ path: "p/:projectId/f/:folderId", element: <></> },
					{ path: "p/:projectId/n/:noteId", element: <NotePreview /> },
					{
						path: "p/:projectId/f/:folderId/n/:noteId",
						element: <NotePreview />,
					},
					{ path: "*", element: <NotFound /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFound /> },
]);
