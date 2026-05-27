import cors from "cors";
import express from "express";
import morgan from "morgan";
import { FRONTEND_URL } from "./config/env.js";
import healthRouter from "./routes/health.js";
import leadsRouter from "./routes/leads.js";

export function createServer() {
  const app = express();

  app.use(cors({ origin: FRONTEND_URL }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    res.json({ message: "Lead Management API is running", status: "ok" });
  });

  app.use("/health", healthRouter);
  app.use("/api/leads", leadsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
  });

  return app;
}