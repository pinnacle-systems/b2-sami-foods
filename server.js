import 'dotenv/config'
import './src/config/constants.js' // crash early if required env vars are missing
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import routes from './src/routes/index.js'
import errorHandler from './src/middleware/errorHandler.js'

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))

// Global rate limit — 200 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}))

// Strict rate limit on auth endpoints — 20 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
})

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
})
io.on('connection', (socket) => {
  socket.on('disconnect', () => {})
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Apply strict limiter to auth routes before the main router
app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)

// Images have unique timestamped filenames — safe to cache for 1 year in the browser
app.use(
  '/api/uploads',
  express.static('uploads', {
    maxAge: '1y',
    immutable: true,
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    },
  })
)

app.use('/api', routes)

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'B2 Sami Foods API' }))

app.use(errorHandler)

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

export { io }
