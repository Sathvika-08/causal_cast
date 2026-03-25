import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

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

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('name email')
  res.json(user)
})

export default router


