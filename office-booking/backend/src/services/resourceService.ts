import { randomUUID } from "node:crypto";
import { fileRepository } from "../repositories/fileRepository";
import { CreateResourceInput } from "../schemas/resource.schema";

export const resourceService = {

    async getAll() {
        const db = await fileRepository.readDB()
        return db.resources
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