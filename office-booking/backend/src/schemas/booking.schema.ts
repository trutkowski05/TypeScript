import { z } from 'zod';

export const createBookingSchema = z.object({
    resourceId: z.string().uuid({ message: 'Niepoprawne ID zasobu (biurka)' }),
    
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
        message: 'Data musi być w formacie YYYY-MM-DD (np. 2026-07-18)' 
    })
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>
