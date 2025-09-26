import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NotePreview from "./pages/NotePreview";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />}>
				<Route path=":noteId" element={<NotePreview />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
