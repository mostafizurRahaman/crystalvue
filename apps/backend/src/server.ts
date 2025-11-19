import app from "./app";
import { env } from "./app/configs/env";
import { db } from "./app/db";
import { seedSuperAdmin } from "./app/utils";

let server: any | undefined;

// call main server function to start the server, but only after DB connects
const main = async () => {
  try {
    console.log("⏳ Connecting to database...");
    // Try to establish a connection to the database before starting the HTTP server
    await db.$connect();
    console.log("✅ Database connected");

    await seedSuperAdmin();

    server = app.listen(env.PORT, () => {
      console.log("ENV", env);
      console.log(
        `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    // If DB connection fails, exit with a non-zero code so process managers can restart or alert
    process.exit(1);
  }
};

main();

// Graceful shutdown: close server and disconnect Prisma
const shutdown = async (signal?: string) => {
  console.log(`\u23F9 Received ${signal || "shutdown"}, closing server...`);
  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed");
      });
    }

    await db.$disconnect();
    console.log("Prisma client disconnected");
    // In production we want to exit; in development keep process alive if desired
    if (env.NODE_ENV === "production") process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Better error handling for development
process.on("unhandledRejection", (reason, promise) => {
  console.error("\u274c Unhandled Rejection at:", promise, "reason:", reason);

  // Only exit in production
  if (env.NODE_ENV === "production") {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  }
  // In development, just log the error and continue
});

process.on("uncaughtException", (err) => {
  console.error("\u274c Uncaught Exception:", err);
  console.error(err.stack);

  // Only exit in production
  if (env.NODE_ENV === "production") {
    process.exit(1);
  }
  // In development, just log the error and continue
});
