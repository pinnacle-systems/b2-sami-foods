import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CART_API } from "../../Api"

const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: CART_API,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (payload) => ({
        url: `${CART_API}/items`,
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_API}/items/${productId}`,
        method: "PUT",
        body: { quantity },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_API}/items/${productId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: CART_API,
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi

export default cartApi
