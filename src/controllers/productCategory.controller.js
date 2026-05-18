import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/productCategory.service.js'

export const getAll = async (req, res, next) => {
  try {
    const data = await getAllCategories()
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const data = await getCategoryById(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.files?.image?.[0]) {
      payload.image = `api/uploads/${req.files.image[0].filename}`
    }
    if (req.files?.productCategoryImage?.[0]) {
      payload.productCategoryImage = `api/uploads/${req.files.productCategoryImage[0].filename}`
    }
    const data = await createCategory(payload)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    if (req.files?.image?.[0]) {
      payload.image = `api/uploads/${req.files.image[0].filename}`
    }
    if (req.files?.productCategoryImage?.[0]) {
      payload.productCategoryImage = `api/uploads/${req.files.productCategoryImage[0].filename}`
    }
    const data = await updateCategory(req.params.id, payload)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    const data = await deleteCategory(req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
