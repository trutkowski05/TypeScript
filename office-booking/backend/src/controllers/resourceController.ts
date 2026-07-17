import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { fileRepository } from "../repositories/fileRepository";
import { createResourceSchema } from "../schemas/resource.schema";

export const getAllResources = async (req: Request, res: Response) => {
    try {
        const db = await fileRepository.readDB()
        
        if (!db.resources) {
            throw new Error("Pusta baza danych!")
        }
        return res.status(200).json({ status: "success", data: db.resources, message: "Pomyślnie załadowano dane z bazy" })
    }

    catch (error) {
        console.error("Nie udało się pobrać danych z bazy!")
        return res.status(500).json({ error: "Nie udało się pobrać danych z bazy!" })
    }
}

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createResourceSchema.parse(req.body)

        const db = await fileRepository.readDB()

        const newResource = {
            id: randomUUID(),
            name: validatedData.name,
            type: validatedData.type,
            isActive: validatedData.isActive
        }

        db.resources.push(newResource)

        await fileRepository.writeDB(db)

        return res.status(201).json({ 
            status:"success", 
            data: newResource, 
            message: "Pomyślnie dodano nowe biurko!"
        })
    }

    catch (error) {
        next(error)
    }
}