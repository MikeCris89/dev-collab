import "./App.css";
import Login from "./components/pages/Login";
import Notes from "./components/pages/Notes";
import { useAuth } from "./context/AuthContext";
import NotesProvider from "./context/NotesContext";

function App() {
	const { user, isLoading } = useAuth();

	return (
		<main>
			{isLoading ? (
				<p>Loading...</p>
			) : user ? (
				<NotesProvider>
					<Notes />{" "}
				</NotesProvider>
			) : (
				<Login />
			)}
		</main>
	);
}

export default App;
