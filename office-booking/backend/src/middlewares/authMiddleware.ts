import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'moja-super-tajna-restauracja';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Brak dostępu! Musisz być zalogowany.'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
            status: 'error',
            message: 'Brak dostępu! Nieprawidłowy format biletu.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string, role: string };

        req.user = decoded;

        next();
        
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Twój bilet wstępu wygasł lub jest sfałszowany. Zaloguj się ponownie.'
        });
    }
};
