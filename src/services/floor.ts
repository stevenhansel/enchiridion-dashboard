import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Floor, UpdateFloor } from "../types/store";

export const floorApi = createApi({
  reducerPath: "floorApi",
  baseQuery: axios(),
  tagTypes: ['Floor'],
  endpoints: (builder) => ({
    getFloors: builder.query<Record<number, Floor>, null>({
      query: () => ({
        url: "/v1/floors",
      }),
      providesTags: () => ['Floor'],
      transformResponse: (response) =>
        response.contents.reduce(
          (prev: Record<number, Floor>, curr: Floor) => ({
            ...prev,
            [curr.id]: curr,
          }),
          {}
        ),
    }),
    createFloor: builder.mutation<UpdateFloor, { name: string, buildingId: number | null }>({
      query: ({ name, buildingId }) => ({
        url: "/v1/floors",
        method: "POST",
        data: { name, buildingId },
      }),
      invalidatesTags: () => ['Floor'],
    }),
    updateFloor: builder.mutation<UpdateFloor, { name: string, buildingId: number | null }>({
      query: ({ name, buildingId }) => ({
        url: `/v1/floors/${buildingId}`,
        method: "PUT",
        data: { name, buildingId },
      }),
      invalidatesTags: () => ['Floor'],
    }),
    deleteFloor: builder.mutation<Floor, { floorId: string }>({
      query: ({ floorId }) => ({
        url: `/v1/floors/${floorId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ['Floor'],
    }),
  }),
});

export const {
  useGetFloorsQuery,
  useUpdateFloorMutation,
  useCreateFloorMutation,
  useDeleteFloorMutation,
} = floorApi;
