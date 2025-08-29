import "./App.css";
import Login from "./components/pages/Login";
import Notes from "./components/pages/Notes";
import { useAuth } from "./context/AuthContext";
import NotesProvider from "./context/NotesContext";

function App() {
	const { user, isLoading } = useAuth();

	return (
		<main className="h-full w-full relative overflow-hidden">
			{isLoading ? (
				<p>Loading...</p>
			) : user ? (
				<NotesProvider>
					<Notes />
				</NotesProvider>
			) : (
				<Login />
			)}
		</main>
	);
}

export default App;
