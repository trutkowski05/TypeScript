import { randomUUID } from "node:crypto";
import { fileRepository } from "../repositories/fileRepository";
import { CreateBookingInput } from "../schemas/booking.schema";
import { Booking } from "../types";

export const bookingService = {
    async create(data : CreateBookingInput) {

        const db = await fileRepository.readDB()

        const resource = db.resources.find(r => r.id === data.resourceId)
        if (!resource) {
            throw new Error("Zasób o podanym ID nie istnieje!")
        }

        if (resource.isActive === false) {
            throw new Error("Ten zasób jest obecnie wyłączony z użytku!")
        }

        const isConflict = db.bookings.find(b =>
            b.resourceId === data.resourceId &&
            b.date === data.date &&
            b.status === 'ACTIVE'
        )

        if (isConflict) {
            throw new Error("To biurko jest już zarezerwowane w tym terminie")
    }

    const newBooking: Booking = {
        id: randomUUID(),
        userId: data.userId,
        resourceId: data.resourceId,
        date: data.date,
        status: 'ACTIVE'
    }

    db.bookings.push(newBooking)
    await fileRepository.writeDB(db)

    return newBooking
    
    }
}