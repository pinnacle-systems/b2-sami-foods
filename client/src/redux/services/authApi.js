import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_API } from "../../Api"

const BASE_URL = process.env.REACT_APP_SERVER_URL

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Auth", "User", "Addresses"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_API}/login`,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_API}/register`,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: `${AUTH_API}/me`,
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_API}/me`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
    createAddress: builder.mutation({
      query: (payload) => ({
        url: `${AUTH_API}/addresses`,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["User", "Addresses"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${AUTH_API}/addresses/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["User", "Addresses"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `${AUTH_API}/addresses/${id}`,
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["User", "Addresses"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateProfileMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = authApi

export default authApi
