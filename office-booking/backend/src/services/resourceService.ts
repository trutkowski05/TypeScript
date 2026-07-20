import { randomUUID } from "node:crypto";
import { fileRepository } from "../repositories/fileRepository";
import { CreateResourceInput } from "../schemas/resource.schema";

export const resourceService = {

    async getAll(date?: string) {
        const db = await fileRepository.readDB()
        
        if (!date) {
            return db.resources
        }

        return db.resources.map(resource => {
            const isBooked = db.bookings.some(b => 
                b.resourceId === resource.id && 
                b.date === date && 
                b.status === 'ACTIVE'
            )
            return {
                ...resource,
                isBooked
            }
        })
    },

    async create(data: CreateResourceInput) {
        const db = await fileRepository.readDB()

        const newResource = {
            id: randomUUID(),
            name: data.name,
            type: data.type,
            isActive: data.isActive
        }

        db.resources.push(newResource)
        await fileRepository.writeDB(db)

        return newResource
    }
}