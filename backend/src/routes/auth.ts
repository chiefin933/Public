import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);

export default router;