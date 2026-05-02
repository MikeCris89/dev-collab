import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useAuth } from "./context/AuthContext";
import Loading from "./components/Loading";

function App() {
	const { isPending } = useAuth();

	if (isPending) return <Loading withText />;

	return (
		<main className="h-full w-full relative overflow-hidden">
			<RouterProvider router={router} />;
		</main>
	);
}

export default App;
