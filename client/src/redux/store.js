import { configureStore, isRejectedWithValue } from "@reduxjs/toolkit"
import authApi from "./services/authApi"
import authReducer, { logout } from "./features/authSlice"
import productCategoryApi from "./services/productCategoryApi"
import productApi from "./services/productApi"
import cartApi from "./services/cartApi"
import wishlistApi from "./services/wishlistApi"

// Auto-logout on any 401 response from any RTK Query endpoint
const authErrorMiddleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action) && action.payload?.status === 401) {
    api.dispatch(logout())
  }
  return next(action)
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]:            authApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer,
    [productApi.reducerPath]:         productApi.reducer,
    [cartApi.reducerPath]:            cartApi.reducer,
    [wishlistApi.reducerPath]:        wishlistApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authErrorMiddleware)
      .concat(authApi.middleware)
      .concat(productCategoryApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(wishlistApi.middleware),
})

export default store
