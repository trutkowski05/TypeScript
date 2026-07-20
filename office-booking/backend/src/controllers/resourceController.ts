import { Request, Response, NextFunction } from "express";
import { createResourceSchema } from "../schemas/resource.schema";
import { resourceService } from "../services/resourceService";

export const getAllResources = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = req.query.date as string | undefined;
        const resources = await resourceService.getAll(date)
        
        return res.status(200).json({
            status: "success",
            data: resources,
            message: "Pomyślnie załadowano dane z bazy"
        })
    }
    catch (error) {
        next(error)
    }
}

export const createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createResourceSchema.parse(req.body);

        const newResource = await resourceService.create(validatedData);

        return res.status(201).json({ 
            status: "success", 
            data: newResource, 
            message: "Pomyślnie dodano nowe biurko!"
        })
    }
    catch (error) {
        next(error);
    }
}
