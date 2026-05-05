import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
	const { isPending } = useAuth();

	useEffect(() => {
		if (isPending) return;

		const splash = document.getElementById("splash");
		if (!splash) return;

		splash.style.opacity = "0";
		setTimeout(() => splash.remove(), 600);
	}, [isPending]);

	if (isPending) return null;

	return (
		<main className="h-full w-full relative overflow-hidden">
			<RouterProvider router={router} />;
		</main>
	);
}

export default App;
