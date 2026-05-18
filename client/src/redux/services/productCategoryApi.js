import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { PRODUCT_CATEGORY_API } from "../../Api"

const productCategoryApi = createApi({
  reducerPath: "productCategoryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_URL,  // → "/api/"
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) headers.set("Authorization", `Bearer ${token}`)
      return headers
    },
  }),

  tagTypes: ["ProductCategory"],

  endpoints: (builder) => ({
    /* ── GET all ── */
    getProductCategories: builder.query({
      query: () => PRODUCT_CATEGORY_API,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ProductCategory", id })),
              { type: "ProductCategory", id: "LIST" },
            ]
          : [{ type: "ProductCategory", id: "LIST" }],
    }),

    /* ── GET single ── */
    getProductCategoryById: builder.query({
      query: (id) => `${PRODUCT_CATEGORY_API}/${id}`,
      providesTags: (_result, _err, id) => [{ type: "ProductCategory", id }],
    }),

    /* ── CREATE ── */
    createProductCategory: builder.mutation({
      query: (body) => ({
        url: PRODUCT_CATEGORY_API,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    /* ── UPDATE ── */
    updateProductCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `${PRODUCT_CATEGORY_API}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    /* ── DELETE ── */
    deleteProductCategory: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_CATEGORY_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetProductCategoriesQuery,
  useGetProductCategoryByIdQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApi

export default productCategoryApi
