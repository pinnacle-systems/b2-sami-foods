import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { PRODUCT_API } from "../../Api"

const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_URL, // "/api/"
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) headers.set("Authorization", `Bearer ${token}`)
      return headers
    },
  }),

  tagTypes: ["Product"],

  endpoints: (builder) => ({
    /* ── GET all ── */
    getProducts: builder.query({
      query: () => PRODUCT_API,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    /* ── GET single ── */
    getProductById: builder.query({
      query: (id) => `${PRODUCT_API}/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Product", id }],
    }),

    /* ── CREATE ── */
    createProduct: builder.mutation({
      query: (body) => ({
        url: PRODUCT_API,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    /* ── UPDATE ── */
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `${PRODUCT_API}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    /* ── DELETE ── */
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi

export default productApi
