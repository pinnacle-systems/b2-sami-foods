import * as cartService from '../services/cart.service.js'

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user.id)
    res.json({ success: true, data: cart })
  } catch (err) {
    next(err)
  }
}

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body
    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' })
    const cart = await cartService.addItemToCart(req.user.id, Number(productId), Number(quantity))
    res.json({ success: true, data: cart })
  } catch (err) {
    next(err)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body
    if (quantity === undefined) return res.status(400).json({ success: false, message: 'quantity is required' })
    const cart = await cartService.updateCartItem(req.user.id, Number(productId), Number(quantity))
    res.json({ success: true, data: cart })
  } catch (err) {
    next(err)
  }
}

export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params
    const cart = await cartService.removeCartItem(req.user.id, Number(productId))
    res.json({ success: true, data: cart })
  } catch (err) {
    next(err)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id)
    res.json({ success: true, data: cart })
  } catch (err) {
    next(err)
  }
}
