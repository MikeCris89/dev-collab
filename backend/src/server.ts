import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler, requireAuth } from "./lib/middleware.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 4001;

app.use(cors({ origin: `http://localhost:5173`, credentials: true }));
app.use(cookieParser());

// Body Parser
app.use(express.json());

// Morgan Logging
app.use(morgan("tiny"));

// Health for Playwright
app.get("/health", (_req, res) => res.sendStatus(200));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/notes", requireAuth, notesRouter);

// Path Not Found
app.use((_req, res) => res.status(404).json({ message: "Not Found" }));

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log("Server running on port: ", PORT);
});
