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

app.get("/api/bookings/stats", (req, res) => {
    const bookings = readBookings();
    const total = bookings.length;

    const serviceCounts: Record<string, number> = {};
    for (const b of bookings) {
        serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    }

    const sformatowaneUslugi = Object.entries(serviceCounts).map(([service, count]) => {
        const percentage = total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0;
        return { service, count, percentage };
    });

    res.json({ totalBookings: total, services: sformatowaneUslugi });
})

app.post("/api/bookings", (req, res) => {
    const { clientName, service, date, time } = req.body

    if (!clientName || !service) {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" })
    }
    if (clientName.trim() === "" || service.trim() === "") {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" })
    }

    const today = new Date().toISOString().split("T")[0]

    if (date < today) {
        return res.status(400).json({ error: "Nie można rezerwować terminów z przeszłości!" })
    }

    const allowedTimes = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00"
    ]

    if (!allowedTimes.includes(time)) {
        return res.status(400).json({ error: "Salon pracuje wyłącznie w godzinach 08:00 - 16:00 (o pełnych godzinach)." })
    }
    let bookings = readBookings()
    const isSlotTaken = bookings.some(b => b.date === date && b.time === time)
    if (isSlotTaken) {
        return res.status(409).json({ error: "Ten termin jest już zarezerwowany przez innego klienta!" })
    }
    const newBooking: Booking = {
        id: Date.now().toString(),
        clientName: clientName,
        service: service,
        date: date,
        time: time
    }
    bookings.push(newBooking)
    writeBooking(bookings)
    return res.status(201).json(newBooking)
})

app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params

    let bookings = readBookings()

    const initialLength = bookings.length

    bookings = bookings.filter(b => b.id !== id)

    if (bookings.length === initialLength) {
        return res.status(404).json({ error: "Nie znaleziono podanej rezerwacji w bazie danych!" })
    }
    writeBooking(bookings)
    res.json({ message: "Rezerwacja została pomyślnie anulowana." })
}) 
 
app.listen(PORT, () => {
    console.log("Serwer działa na porcie 3001")
})

