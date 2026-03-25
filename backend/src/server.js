import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import predictionRoutes from './routes/prediction.js'
import userRoutes from './routes/user.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

const MONGO_URI = process.env.MONGO_URI || ''
const PORT = process.env.PORT || 4000

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment')
  process.exit(1)
}

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected')
}).catch((err) => {
  console.error('MongoDB connection error', err)
  process.exit(1)
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/prediction', predictionRoutes)
app.use('/api/user', userRoutes)

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})


