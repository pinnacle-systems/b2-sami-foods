import * as wishlistService from '../services/wishlist.service.js'

export const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.getWishlist(req.user.id)
    res.json({ success: true, data: items })
  } catch (err) {
    next(err)
  }
}

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params
    const result = await wishlistService.toggleWishlistItem(req.user.id, Number(productId))
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}
