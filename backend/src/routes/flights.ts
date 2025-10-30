import express from "express";
import {
  createFlight,
  getFlights,
  getFlightById,
  updateFlight,
} from "../controllers/flightController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getFlights);
router.get("/:id", getFlightById);

// Protected routes (admin only)
router.use(authenticateToken);
router.post("/", requireRole(["ADMIN"]), createFlight);
router.put("/:id", requireRole(["ADMIN"]), updateFlight);

export default router;