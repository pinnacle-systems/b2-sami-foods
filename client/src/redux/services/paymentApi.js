import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BASE_URL = process.env.REACT_APP_SERVER_URL || "/api"

const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/payment/orders",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
  }),
})

export const { useGetOrdersQuery } = paymentApi

export default paymentApi
