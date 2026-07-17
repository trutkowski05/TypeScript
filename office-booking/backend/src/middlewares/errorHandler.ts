import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof ZodError) {

        const errorMessages = error.issues.map((err: ZodIssue) => err.message);

        return res.status(400).json({
            status: "error",
            message: "Błąd walidacji danych (Zod)!",
            details: errorMessages
        })
    }

    console.error("Błąd serwera:", error)
    return res.status(500).json({
        status: "error",
        message: "Wewnętrzny błąd serwera. Spróbuj ponownie później."
    })
}