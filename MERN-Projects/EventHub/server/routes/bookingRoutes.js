import express from "express";

import {
    bookEvent,
    confirmBooking,
    getMyBookings,
    cancelBooking,
    sendBookingOTP
} from "../controllers/bookingController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-otp", protect, sendBookingOTP);

router.post("/", protect, bookEvent);

router.put("/:id/confirm", protect, admin, confirmBooking);

router.get("/my", protect, getMyBookings);

router.delete("/:id", protect, cancelBooking);

export default router;