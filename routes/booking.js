import express from "express";
import { isLoggedIn } from "../middleware.js";
import wrapAsync from "../utils/wrapAsync.js";
import BookingController from "../controllers/booking.js";

const router = express.Router();

router.get("/my", isLoggedIn, wrapAsync(BookingController.showMyBookings));
router.post("/", isLoggedIn, wrapAsync(BookingController.createBooking));
router.delete("/:id", isLoggedIn, wrapAsync(BookingController.cancelBooking));

export default router;
