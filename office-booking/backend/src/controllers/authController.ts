import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export const authController = {

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = registerSchema.parse(req.body);

            const newUser = await authService.register(validatedData);
            
            res.status(201).json({
                status: 'success',
                data: newUser,
                message: 'Konto zostało pomyślnie utworzone!'
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = loginSchema.parse(req.body);

            const result = await authService.login(validatedData);

            res.status(200).json({
                status: 'success',
                data: result,
                message: 'Zalogowano pomyślnie!'
            });
        } catch (error) {
            next(error);
        }
    }
};
