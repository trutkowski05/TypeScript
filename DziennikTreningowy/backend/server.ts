import express from "express";
import cors from "cors"
import treningiRoutes from "./treningi.routes.js"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/api/treningi', treningiRoutes)

app.listen(PORT, () => console.log('Serwer działa na porcie 3001'))