import "./App.css";
import { useAuth } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";

function App() {
	const { isLoading } = useAuth();

	if (isLoading) return <h3>Loading...</h3>;

	return (
		<main className="h-full w-full relative overflow-hidden">
			<RouterProvider router={router} />;
		</main>
	);
}

export default App;
