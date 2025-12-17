import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler, requireAuth } from "./lib/middleware.js";
import dotenv from "dotenv";
import teamRouter from "./routes/team.js";
import projectsRouter from "./routes/projects.js";
import foldersRouter from "./routes/folders.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = 4001;

app.use(cors({ origin: process.env.PUBLIC_URL, credentials: true }));
app.use(cookieParser());

// Body Parser
app.use(express.json());

// Morgan Logging
app.use(morgan("tiny"));

// Health for Playwright
app.get("/health", (_req, res) => res.sendStatus(200));

// Routers
app.use("/api/auth", authRouter);

app.use(requireAuth);

app.use("/api/team", teamRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);
// app.use("/api/notes", commentsRouter);

// Path Not Found
app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log("Server running on port: ", PORT);
});
