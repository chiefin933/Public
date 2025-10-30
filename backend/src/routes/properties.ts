import express from "express";
import {
  createProperty,
  getProperties,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getProperties);

// Protected routes
router.use(authenticateToken);
router.get("/my", getMyProperties);
router.post("/", requireRole(["OWNER", "ADMIN"]), createProperty);
router.put("/:id", requireRole(["OWNER", "ADMIN"]), updateProperty);
router.delete("/:id", requireRole(["OWNER", "ADMIN"]), deleteProperty);

export default router;