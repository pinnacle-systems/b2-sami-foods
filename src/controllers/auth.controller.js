import { 
  registerUser, loginUser, getUserById, updateUser,
  createAddress, getAddressesByUserId, updateAddress, deleteAddress
} from '../services/auth.service.js'

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

export const updateProfile = async (req, res, next) => {
  try {
    const result = await updateUser(req.user.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getAddresses = async (req, res, next) => {
  try {
    const list = await getAddressesByUserId(req.user.id)
    res.json(list)
  } catch (err) {
    next(err)
  }
}

export const createNewAddress = async (req, res, next) => {
  try {
    const result = await createAddress(req.user.id, req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const updateAddressById = async (req, res, next) => {
  try {
    const result = await updateAddress(req.params.id, req.user.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const deleteAddressById = async (req, res, next) => {
  try {
    const result = await deleteAddress(req.params.id, req.user.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
