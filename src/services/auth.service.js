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
    where: { id: Number(id) },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      mobile: true, 
      role: true, 
      createdAt: true,
      Addresses: true 
    },
  })

  if (!user) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }

  return user
}

export const updateUser = async (id, { name, email, password, mobile }) => {
  if (!name || !name.trim()) {
    const err = new Error('Name is required')
    err.status = 400
    throw err
  }
  if (!email || !email.trim()) {
    const err = new Error('Email is required')
    err.status = 400
    throw err
  }

  const exists = await prisma.user.findFirst({
    where: {
      email: email.trim(),
      NOT: { id: Number(id) }
    }
  })
  if (exists) {
    const err = new Error('Email is already registered by another user')
    err.status = 409
    throw err
  }

  const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } })
  if (!existingUser) {
    const err = new Error('User not found')
    err.status = 404
    throw err
  }

  const updateData = {
    name: name.trim(),
    email: email.trim(),
    mobile: mobile || null,
  }

  if (password && password.trim()) {
    updateData.password = await bcrypt.hash(password.trim(), 10)
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: updateData
  })

  return safeUser(updatedUser)
}

export const createAddress = async (userId, data) => {
  return prisma.addresses.create({
    data: {
      name: data.name,
      mobile: data.mobile,
      alterNateMobile: data.alterNateMobile || null,
      pinCode: data.pinCode,
      city: data.city,
      state: data.state,
      address: data.address,
      landMark: data.landMark || null,
      addressType: data.addressType || "Home",
      userId: Number(userId)
    }
  })
}

export const getAddressesByUserId = async (userId) => {
  return prisma.addresses.findMany({
    where: { userId: Number(userId) }
  })
}

export const updateAddress = async (addressId, userId, data) => {
  const address = await prisma.addresses.findUnique({
    where: { id: Number(addressId) }
  })

  if (!address || address.userId !== Number(userId)) {
    const err = new Error('Address not found or unauthorized')
    err.status = 404
    throw err
  }

  return prisma.addresses.update({
    where: { id: Number(addressId) },
    data: {
      name: data.name,
      mobile: data.mobile,
      alterNateMobile: data.alterNateMobile || null,
      pinCode: data.pinCode,
      city: data.city,
      state: data.state,
      address: data.address,
      landMark: data.landMark || null,
      addressType: data.addressType || "Home",
    }
  })
}

export const deleteAddress = async (addressId, userId) => {
  const address = await prisma.addresses.findUnique({
    where: { id: Number(addressId) }
  })

  if (!address || address.userId !== Number(userId)) {
    const err = new Error('Address not found or unauthorized')
    err.status = 404
    throw err
  }

  return prisma.addresses.delete({
    where: { id: Number(addressId) }
  })
}
