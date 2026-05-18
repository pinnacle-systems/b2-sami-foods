import { registerUser, loginUser, getUserById } from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
}
