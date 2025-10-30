import express from "express";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/bookingController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.put("/:id/status", updateBookingStatus);

export default router;