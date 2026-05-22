import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { WISHLIST_API } from "../../Api"

const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: WISHLIST_API,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      providesTags: ["Wishlist"],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: `${WISHLIST_API}/${productId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
})

export const { useGetWishlistQuery, useToggleWishlistMutation } = wishlistApi

export default wishlistApi
