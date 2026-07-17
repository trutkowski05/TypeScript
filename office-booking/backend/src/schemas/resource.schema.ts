import { z } from 'zod'

export const createResourceSchema = z.object({
    name: z.string().min(3, "Nazwa musi mieć minimum 3 znaki!"),
    type: z.enum(['DESK', 'ROOM'], {
        message: "Typ musi być DESK albo ROOM"
    }),
    isActive: z.boolean()
})

export type CreateResourceInput = z.infer<typeof createResourceSchema>