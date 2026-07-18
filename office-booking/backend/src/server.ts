import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import resourceRoutes from './routes/resourceRoutes'
import { errorHandler } from './middlewares/errorHandler'
import bookingRoutes from './routes/bookingRoutes'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Serwer rezerwacji działa'})
})

app.use('/api/v1/resources', resourceRoutes)
app.use('/api/v1/bookings', bookingRoutes)


app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`)
})