import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
} from "../controllers/vehicleController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Protected routes (admin only)
router.use(authenticateToken);
router.post("/", requireRole(["ADMIN"]), createVehicle);
router.put("/:id", requireRole(["ADMIN"]), updateVehicle);

export default router;