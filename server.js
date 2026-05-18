import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import routes from './src/routes/index.js'
import errorHandler from './src/middleware/errorHandler.js'

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
})
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/uploads', express.static('uploads'))

app.use('/api', routes)

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'B2 Sami Foods API' }))

app.use(errorHandler)

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

export { io }
