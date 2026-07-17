import fs from 'fs/promises'
import path from 'path'
import { User, Resource, Booking } from '../types'


const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

export interface Database {
    users: User[],
    resources: Resource[],
    bookings: Booking[]
}

export const fileRepository = {
    
    readDB: async (): Promise<Database> => {
        try {
            const fileContent = await fs.readFile(DB_PATH, 'utf-8');
            
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Błąd odczytu bazy:", error);
            throw new Error("Nie można odczytać bazy danych");
        }
    },

    writeDB: async (data: Database): Promise<void> => {
        try {
            const stringifiedData = JSON.stringify(data, null, 2)

            await fs.writeFile(DB_PATH, stringifiedData, 'utf-8')
        }
        catch (error) {
            console.error("Błąd zapisu bazy: ", error)
            throw new Error("Nie można zapisać bazy danych")
        }
    }
}