import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Floor, Pagination, UpdateFloor } from "../types/store";
import { urlBuilder } from "../utils";

export const floorApi = createApi({
  reducerPath: "floorApi",
  baseQuery: axios(),
  tagTypes: ["Floor"],
  endpoints: (builders) => ({
    getFloors: builders.query<
      Pagination<Floor>,
      {
        page?: number;
        limit?: number;
        query?: string;
      } | null
    >({
      query: (params) => ({ url: urlBuilder("v1/floors", params) }),
      providesTags: () => ["Floor"],
      transformResponse: (response) => ({
        hasNext: response.hasNext,
        count: response.count,
        totalPages: response.totalPages,
        contents: response.contents,
      }),
    }),
    createFloor: builders.mutation<
      UpdateFloor,
      { name: string; buildingId: number | null }
    >({
      query: ({ name, buildingId }) => ({
        url: "/v1/floors",
        method: "POST",
        data: { name, buildingId },
      }),
      invalidatesTags: () => ["Floor"],
    }),
    updateFloor: builders.mutation<
      UpdateFloor,
      { name: string; buildingId: number | null }
    >({
      query: ({ name, buildingId }) => ({
        url: `/v1/floors/${buildingId}`,
        method: "PUT",
        data: { name, buildingId },
      }),
      invalidatesTags: () => ["Floor"],
    }),
    deleteFloor: builders.mutation<Floor, { floorId: string }>({
      query: ({ floorId }) => ({
        url: `/v1/floors/${floorId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Floor"],
    }),
  }),
});

export const {
  useGetFloorsQuery,
  useUpdateFloorMutation,
  useCreateFloorMutation,
  useDeleteFloorMutation,
  useLazyGetFloorsQuery,
} = floorApi;
