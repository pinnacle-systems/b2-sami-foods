import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UOM_API } from "../../Api";

const uomApi = createApi({
  reducerPath: "uomApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_URL, // → "/api/"
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Uom"],

  endpoints: (builder) => ({
    /* ── GET all ── */
    getUoms: builder.query({
      query: () => UOM_API,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Uom", id })),
              { type: "Uom", id: "LIST" },
            ]
          : [{ type: "Uom", id: "LIST" }],
    }),

    /* ── GET single ── */
    getUomById: builder.query({
      query: (id) => `${UOM_API}/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Uom", id }],
    }),

    /* ── CREATE ── */
    createUom: builder.mutation({
      query: (body) => ({
        url: UOM_API,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Uom", id: "LIST" }],
    }),

    /* ── UPDATE ── */
    updateUom: builder.mutation({
      query: ({ id, body }) => ({
        url: `${UOM_API}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Uom", id },
        { type: "Uom", id: "LIST" },
      ],
    }),

    /* ── DELETE ── */
    deleteUom: builder.mutation({
      query: (id) => ({
        url: `${UOM_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Uom", id },
        { type: "Uom", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUomsQuery,
  useGetUomByIdQuery,
  useCreateUomMutation,
  useUpdateUomMutation,
  useDeleteUomMutation,
} = uomApi;

export default uomApi;
