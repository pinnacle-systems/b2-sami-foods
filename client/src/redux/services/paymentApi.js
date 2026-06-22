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
    getAllOrdersAdmin: builder.query({
      query: () => ({
        url: "/payment/admin/orders",
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Order"],
    }),
    updateDeliveryStatus: builder.mutation({
      query: ({ id, deliveryStatus }) => ({
        url: `/payment/admin/orders/${id}/delivery`,
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: { deliveryStatus }
      }),
      invalidatesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body
      }),
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/verify",
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body
      }),
      invalidatesTags: ["Order"],
    }),
  }),
})

export const { useGetOrdersQuery, useGetAllOrdersAdminQuery, useUpdateDeliveryStatusMutation, useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi

export default paymentApi
