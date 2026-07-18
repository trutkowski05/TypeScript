import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().email("Niepoprawny format adresu e-mail!"),
    password: z.string().min(6, "Hasło musi mieć minimum 6 znaków!"),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional()
})

export const loginSchema = z.object({
    email: z.string().email("Niepoprawny format adresu e-mail!"),
    password: z.string().min(1, "Hasło jest wymagane!")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>