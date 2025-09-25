import "./App.css";
import Login from "./components/pages/Login";
import { useAuth } from "./context/AuthContext";
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import type { User } from "./lib/types";
import Signup from "./components/pages/Signup";
import Home from "./components/pages/Home";
import NotePreview from "./components/NotePreview";
import NotesProvider from "./context/NotesContext";
import NotFound from "./components/pages/NotFound";

const PublicRoutes = () => {
	const { user } = useAuth();
	const location = useLocation();
	if (user) {
		return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
	}

	return <Outlet />;
};

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

function App() {
	const { isLoading } = useAuth();

	if (isLoading) return <h3>Loading...</h3>;

	return (
		<main className="h-full w-full relative overflow-hidden">
			<BrowserRouter>
				<Routes>
					<Route element={<PublicRoutes />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>

					<Route element={<PrivateRoutes />}>
						<Route path="/" element={<Home />}>
							<Route
								path="p/:projectId/f/:folderId/n/:noteId"
								element={<NotePreview />}
							/>
							<Route path="p/:projectId/n/:noteId" element={<NotePreview />} />
						</Route>
						<Route path="/p/:projectId" element={<Home />} />
						<Route path="/p/:projectId/f/:folderId" element={<Home />} />
					</Route>
					<Route path="*" element={<NotFound />} />

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</main>
	);
}

export default App;
