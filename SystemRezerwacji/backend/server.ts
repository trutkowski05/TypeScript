import express from "express";
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 3001

const DATA_PATH = path.join(import.meta.dirname, "data", "bookings.json")

app.use(cors())
app.use(express.json())

interface Booking {
    id: string,
    clientName: string,
    service: string,
    date: string,
    time: string
}

export function readBookings(): Booking[] {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, '[]', 'utf-8')
        return []
    }

    const bookings = fs.readFileSync(DATA_PATH, 'utf-8')
    const parsedBookings = JSON.parse(bookings)
    return parsedBookings
}

export function writeBooking(data: Booking[]): void {
    const parsedData = JSON.stringify(data, null, 2)
    fs.writeFileSync(DATA_PATH, parsedData)
    return
}

app.get("/api/bookings", (req, res) => {
    let bookings = readBookings()

    const dateQuery = req.query.date as string | undefined
    if (dateQuery) {
        bookings = bookings.filter(b => b.date === dateQuery)
    }
    res.json(bookings)
})

app.listen(PORT, () => {
    console.log("Serwer działa na porcie 3001")
})

