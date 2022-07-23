import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const floorApi = createApi({
  reducerPath: "floorApi",
  baseQuery: axios(),
  endpoints: (builder) => ({
    getFloors: builder.query({
      query: () => ({
        url: "/v1/floors",
      }),
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
