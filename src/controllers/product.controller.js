import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service.js'

export const getAll = async (req, res, next) => {
  try {
    const data = await getAllProducts()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const data = await getProductById(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    // Multer handles file upload
    if (req.file) {
      payload.productImage = `api/uploads/${req.file.filename}`
    }
    // Parse boolean status if it was sent as a string in FormData
    if (payload.productStatus !== undefined) {
      payload.productStatus = payload.productStatus === 'true'
    }
    const data = await createProduct(payload)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.file) {
      payload.productImage = `api/uploads/${req.file.filename}`
    }
    if (payload.productStatus !== undefined) {
      payload.productStatus = payload.productStatus === 'true'
    }
    const data = await updateProduct(req.params.id, payload)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const data = await deleteProduct(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
