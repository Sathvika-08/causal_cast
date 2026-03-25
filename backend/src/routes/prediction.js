import { Router } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Prediction from '../models/Prediction.js'
import { buildPredictionPdf } from '../utils/pdf.js'

const router = Router()

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

router.post('/new', auth, async (req, res) => {
  const { ticker, historical_vol_seq, news_texts, dan3_token_ids, horizon } = req.body
  try {
    const fastapiUrl = process.env.MODELS_URL || 'http://localhost:8002/v1/predict'
    const { data } = await axios.post(fastapiUrl, {
      historical_vol_seq,
      news_texts,
      dan3_token_ids,
      horizon: horizon || 1,
    })

    const doc = await Prediction.create({
      userId: req.userId,
      ticker,
      request: req.body,
      result: data,
    })
    res.json({ id: doc._id, ...data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Prediction failed' })
  }
})

router.get('/history', auth, async (req, res) => {
  const docs = await Prediction.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50)
  res.json(docs)
})

router.get('/:id/pdf', auth, async (req, res) => {
  const doc = await Prediction.findOne({ _id: req.params.id, userId: req.userId })
  if (!doc) return res.status(404).json({ message: 'Not found' })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${doc.ticker || 'report'}.pdf"`)
  const pdf = buildPredictionPdf(doc)
  pdf.pipe(res)
})

// New endpoint to fetch volatility data from Yahoo Finance
router.get('/volatility/:ticker', auth, async (req, res) => {
  const { ticker } = req.params
  const { period = '1y', window = 30 } = req.query
  
  try {
    // Call the FastAPI service to get volatility data
    const fastapiUrl = process.env.MODELS_URL || 'http://localhost:8002/v1/predict'
    const baseUrl = fastapiUrl.replace('/v1/predict', '') // Remove the /v1/predict part
    const { data } = await axios.get(`${baseUrl}/v1/volatility/${ticker}`, {
      params: { period, window }
    })
    
    res.json(data)
  } catch (err) {
    console.error('Error fetching volatility data:', err)
    res.status(500).json({ 
      message: 'Failed to fetch volatility data',
      error: err.message 
    })
  }
})

export default router


