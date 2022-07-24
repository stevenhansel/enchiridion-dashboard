import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Floor } from '../types/store';

export const floorApi = createApi({
  reducerPath: "floorApi",
  baseQuery: axios(),
  endpoints: (builder) => ({
    getFloors: builder.query<Record<number, Floor>, null>({
      query: () => ({
        url: "/v1/floors",
      }),
      transformResponse: (response) => response.contents.reduce(
        (prev: Record<number, Floor>, curr: Floor) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {},
      )
    }),
    createFloor: builder.mutation({
        query: ({ name, buildingId }) => ({
          url: "/v1/floors",
          method: 'POST',
          data: { name, buildingId: +buildingId },
        }),
      }),
      updateFloor: builder.mutation({
        query: ({ name, buildingId }) => ({
          url: "v1/floors/:floorId",
          method:'PUT',
          data:{ name, buildingId },
        })
      })
  }),
});


export const { useGetFloorsQuery, useCreateFloorMutation } =
  floorApi;
