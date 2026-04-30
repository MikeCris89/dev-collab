import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
	return (
		<main className="h-full w-full relative overflow-hidden">
			<RouterProvider router={router} />;
		</main>
	);
}

export default App;
