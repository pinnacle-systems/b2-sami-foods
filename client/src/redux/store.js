import { configureStore } from "@reduxjs/toolkit"
import authApi from "./services/authApi"
import authReducer from "./features/authSlice"
import productCategoryApi from "./services/productCategoryApi"
import productApi from "./services/productApi"

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]:             authApi.reducer,
    [productCategoryApi.reducerPath]:  productCategoryApi.reducer,
    [productApi.reducerPath]:          productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productCategoryApi.middleware)
      .concat(productApi.middleware),
})

export default store
