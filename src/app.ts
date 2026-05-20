import express from "express";
import cors from "cors";
import "dotenv/config";

import apiRoutes from "./routes/index.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const app = express();

app.use(
  cors({
    origin: process.env["CORS_ORIGIN"]?.split(",") ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", apiRoutes);

// 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

export default app;
