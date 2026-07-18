import { Router } from "express";
import { createBooking } from "../controllers/bookingController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/', authMiddleware, createBooking);

export default router;
