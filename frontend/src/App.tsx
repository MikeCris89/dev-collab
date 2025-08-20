import "./App.css";
import type { NoteInput } from "./lib/types";

function App() {
	const data: NoteInput = { title: "test", content: "testing" };
	return (
		<main className="flex justify-between items-center h-full w-full">
			<section className="hidden md:flex md:flex-col  h-[95%]  w-[300px] bg-neutral-700 p-3 rounded-lg">
				<input placeholder="search..." />
				<div className="flex justify-between items-center">
					<h2>My Notes</h2>
					<button>+New Note</button>
				</div>
				<div className="divide-y divide-neutral-300">
					<div>
						<h3>Notes 1</h3>
						<p>These are the notes for notes...</p>
					</div>
					<div>
						<h3>Notes 2</h3>
						<p>These are the notes for notes...</p>
					</div>
				</div>
			</section>
			<section className="flex-1 flex flex-col gap-3 justify-start items-center h-[95%]">
				<div className="self-end flex gap-3">
					<button>edit</button>
					<button>delete</button>
				</div>
				<h1>Notes 1</h1>
				<p>These are the notes for notes...</p>
			</section>
		</main>
	);
}

export default App;
