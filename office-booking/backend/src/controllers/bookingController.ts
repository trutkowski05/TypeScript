import { Request, Response, NextFunction } from "express";
import { createBookingSchema } from "../schemas/booking.schema";
import { bookingService } from "../services/bookingService";

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createBookingSchema.parse(req.body);

        const newBooking = await bookingService.create(validatedData);

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
