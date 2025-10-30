import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import flightRoutes from "./routes/flights";
import vehicleRoutes from "./routes/vehicles";
import bookingRoutes from "./routes/bookings";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, "../../")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// Test error endpoint
app.get("/api/error-test", (req: Request, res: Response, next: NextFunction) => {
  next(new Error("Test error"));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
  next(err);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;