import express, { type Application } from "express";
import cors from "cors";
import { allRoutes } from "./app/routes";
import { notFoundHandler } from "./app/middlewares";
import globalErrorHandler from "./app/middlewares/global-error-handler";
import { db } from "./app/db";

// create an app :
const app: Application = express();

// application label middleware :
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the professional glass server!",
  });
});

// health check route:
app.get("/health", async (req, res) => {
  // Lightweight DB check. For Postgres, `SELECT 1` is a cheap query.
  try {
    await db.$queryRaw`SELECT 1`;
    return res
      .status(200)
      .json({ status: "OK", message: "Server and DB are healthy" });
  } catch (err) {
    // If DB is not reachable, return 503 Service Unavailable
    console.error("Health check DB error:", err);
    return res
      .status(503)
      .json({ status: "FAIL", message: "Database unreachable" });
  }
});

// api v1 routes :
app.use("/api/v1", allRoutes);

// not found routes :
app.use(notFoundHandler);

// ** Global Error Handler ** //
app.use(globalErrorHandler);

export default app;
