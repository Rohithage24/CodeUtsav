// app.js

import express from 'express'
import cors from 'cors'
import http from 'http'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
// import profileRouter from './routes/profile.routes.js'

dotenv.config()

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
// Flutter sends cookies — credentials: true is required
app.use(
  cors({
    origin:
      'http://localhost:56841/ ' || process.env.CORS_ORIGIN === '*'
        ? true // Allow all origins in dev
        : process.env.CORS_ORIGIN,
    credentials: true, // Required for cookies
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Trust proxy (for accurate IP in rate limiter behind reverse proxy)
app.set('trust proxy', 1)

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/user', authRoutes)
// app.use('/api/profile', profileRouter)




// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  })
})

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ success: false, message: errors[0], errors })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.'
    })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

const server = http.createServer(app)
export default server
