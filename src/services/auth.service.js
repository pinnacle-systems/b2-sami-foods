import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js'

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role,
})

export const registerUser = async ({ name, email, password, mobile }) => {
  if (!name || !email || !password) {
    const err = new Error('All fields are required')
    err.status = 400
    throw err
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    const err = new Error('Email already registered')
    err.status = 409
    throw err
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hashed, mobile } })

  return { token: generateToken(user), user: safeUser(user) }
}

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required')
    err.status = 400
    throw err
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  return { token: generateToken(user), user: safeUser(user) }
}

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, mobile: true, role: true, createdAt: true },
  })

  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }

  return user
}
