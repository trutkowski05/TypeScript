import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createBookingSchema } from "../schemas/booking.schema";
import { bookingService } from "../services/bookingService";

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ status: "error", message: "Brak autoryzacji" });
        }

        const validatedData = createBookingSchema.parse(req.body);

        const newBooking = await bookingService.create(validatedData, req.user.id);

        return res.status(201).json({
            status: "success",
            data: newBooking,
            message: "Rezerwacja zakończona sukcesem!"
        })
    }
    catch (error) {
        next(error);
    }
}
