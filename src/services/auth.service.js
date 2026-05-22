import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

const safeUser = (user) => ({
  id:       user.id,
  name:     user.name,
  lastName: user.lastName,
  email:    user.email,
  mobile:   user.mobile,
  role:     user.role,
})

function validateEmail(email) {
  if (!email || !email.trim()) throw Object.assign(new Error('Email is required'), { status: 400 })
  if (!EMAIL_RE.test(email.trim())) throw Object.assign(new Error('Invalid email format'), { status: 400 })
}

function validatePassword(password) {
  if (!password) throw Object.assign(new Error('Password is required'), { status: 400 })
  if (password.length < 8) throw Object.assign(new Error('Password must be at least 8 characters'), { status: 400 })
}

export const registerUser = async ({ name, email, password, mobile }) => {
  if (!name || !name.trim()) throw Object.assign(new Error('Name is required'), { status: 400 })
  validateEmail(email)
  validatePassword(password)

  const exists = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 409 })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), password: hashed, mobile: mobile || null },
  })

  return { token: generateToken(user), user: safeUser(user) }
}

export const loginUser = async ({ email, password }) => {
  validateEmail(email)
  if (!password) throw Object.assign(new Error('Password is required'), { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  return { token: generateToken(user), user: safeUser(user) }
}

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, lastName: true, email: true, mobile: true, role: true, createdAt: true, Addresses: true },
  })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

export const updateUser = async (id, { name, lastName, email, mobile, currentPassword, newPassword }) => {
  if (!name || !name.trim()) throw Object.assign(new Error('Name is required'), { status: 400 })
  validateEmail(email)

  const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } })
  if (!existingUser) throw Object.assign(new Error('User not found'), { status: 404 })

  const emailConflict = await prisma.user.findFirst({
    where: { email: email.trim().toLowerCase(), NOT: { id: Number(id) } },
  })
  if (emailConflict) throw Object.assign(new Error('Email is already used by another account'), { status: 409 })

  const updateData = {
    name:     name.trim(),
    lastName: lastName?.trim() || null,
    email:    email.trim().toLowerCase(),
    mobile:   mobile || null,
  }

  if (newPassword) {
    // Require current password verification before any password change
    if (!currentPassword) throw Object.assign(new Error('Current password is required to set a new password'), { status: 400 })
    validatePassword(newPassword)
    const match = await bcrypt.compare(currentPassword, existingUser.password)
    if (!match) throw Object.assign(new Error('Current password is incorrect'), { status: 401 })
    updateData.password = await bcrypt.hash(newPassword, 10)
  }

  const updated = await prisma.user.update({ where: { id: Number(id) }, data: updateData })
  return safeUser(updated)
}

export const createAddress = async (userId, data) => {
  const required = ['name', 'mobile', 'pinCode', 'city', 'state', 'address']
  for (const field of required) {
    if (!data[field] || !String(data[field]).trim()) {
      throw Object.assign(new Error(`${field} is required`), { status: 400 })
    }
  }
  return prisma.addresses.create({
    data: {
      name:            data.name.trim(),
      mobile:          data.mobile.trim(),
      alterNateMobile: data.alterNateMobile?.trim() || null,
      pinCode:         data.pinCode.trim(),
      city:            data.city.trim(),
      state:           data.state.trim(),
      address:         data.address.trim(),
      landMark:        data.landMark?.trim() || null,
      addressType:     data.addressType || 'Home',
      userId:          Number(userId),
    },
  })
}

export const getAddressesByUserId = async (userId) => {
  return prisma.addresses.findMany({ where: { userId: Number(userId) } })
}

export const updateAddress = async (addressId, userId, data) => {
  const address = await prisma.addresses.findUnique({ where: { id: Number(addressId) } })
  if (!address || address.userId !== Number(userId)) {
    throw Object.assign(new Error('Address not found or unauthorized'), { status: 404 })
  }
  return prisma.addresses.update({
    where: { id: Number(addressId) },
    data: {
      name:            data.name,
      mobile:          data.mobile,
      alterNateMobile: data.alterNateMobile || null,
      pinCode:         data.pinCode,
      city:            data.city,
      state:           data.state,
      address:         data.address,
      landMark:        data.landMark || null,
      addressType:     data.addressType || 'Home',
    },
  })
}

export const deleteAddress = async (addressId, userId) => {
  const address = await prisma.addresses.findUnique({ where: { id: Number(addressId) } })
  if (!address || address.userId !== Number(userId)) {
    throw Object.assign(new Error('Address not found or unauthorized'), { status: 404 })
  }
  return prisma.addresses.delete({ where: { id: Number(addressId) } })
}
