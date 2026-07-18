import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { fileRepository } from '../repositories/fileRepository';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'moja-super-tajna-restauracja';

export const authService = {

    async register(data: RegisterInput) {
        const db = await fileRepository.readDB();

        const emailExists = db.users.find(u => u.email === data.email);
        if (emailExists) {
            throw new Error("Ten adres e-mail jest już zajęty!");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser: User = {
            id: randomUUID(),
            email: data.email,
            passwordHash: hashedPassword, 
            role: data.role || 'EMPLOYEE' 
        };

        db.users.push(newUser);
        await fileRepository.writeDB(db);

        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        };
    },

    async login(data: LoginInput) {
        const db = await fileRepository.readDB();

        const user = db.users.find(u => u.email === data.email);
        
        if (!user) {
            throw new Error("Nieprawidłowy adres e-mail lub hasło");
        }

        const isPasswordCorrect = await bcrypt.compare(data.password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new Error("Nieprawidłowy adres e-mail lub hasło");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return {
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
};
