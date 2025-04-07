import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupDatabase } from "./setup";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database setup before starting the server
  try {
    log('Running database setup...');
    await setupDatabase();
    log('Database setup completed!');
  } catch (error) {
    log('Database setup error: ' + error);
    // Continue even if setup fails, as tables might already exist
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use the port provided by environment variable (for Render) or default to 5000
  // this serves both the API and the client.
  const port = process.env.PORT || 5000;
  
  // More explicit port binding for Render detection
  console.log(`STARTING SERVER on port ${port} with host 0.0.0.0`);
  
  server.listen({
    port: Number(port),
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`==================================`);
    console.log(`SERVER STARTED on port ${port} (host: 0.0.0.0)`);
    console.log(`==================================`);
    log(`serving on port ${port}`);
    
    // Keep the application alive by preventing early exit
    process.on('SIGINT', () => {
      console.log('Gracefully shutting down from SIGINT (Ctrl+C)');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  });
})();
