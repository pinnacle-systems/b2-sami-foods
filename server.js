import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import routes from './src/routes/index.js'
import errorHandler from './src/middleware/errorHandler.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

// Socket.io
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
})
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Health check
app.get('/', (_req, res) => res.json({ status: 'ok', message: 'B2 Sami Foods API' }))

// Error handler (must be last)
app.use(errorHandler)

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

export { io }
