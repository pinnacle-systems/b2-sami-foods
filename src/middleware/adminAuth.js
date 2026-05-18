import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { JWT_SECRET } from '../config/constants.js'

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true },
    })
    if (!user || user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied. Admins only.' })

    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default adminAuth
