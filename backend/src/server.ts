import notesRouter from "./routes/notes.js";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { CustomError } from "./lib/errors.js";
const app = express();
const PORT = 4001;

// CORS
app.use(cors({ origin: `http://localhost:5173` }));

// Body Parser
app.use(express.json());

// Notes Router
app.use("/api/notes", notesRouter);

// Path Not Found
app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

// Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json(err.serialize());
	}

	const isProd = process.env.NODE_ENV === "production";
	const message = err instanceof Error ? err.message : "Internal server error";
	const stack = err instanceof Error ? err.stack : "no stack trace";

	return res.status(500).json({
		message: message,
		...(isProd ? {} : { error: stack }),
	});
});

app.listen(PORT, () => {
	console.log("Server running on port: ", PORT);
});
