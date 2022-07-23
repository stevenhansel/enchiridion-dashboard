import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const buildingApi = createApi({
  reducerPath: "buildingApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getBuildings: builders.query({
      query: () => ({
        url: "/v1/buildings",
      }),
    }),
    createBuilding: builders.mutation({
      query: ({ name, buildingId }) => ({
        url: "/v1/buildings",
        method: "POST",
        data: { name, buildingId },
      }),
    }),
    updateBuilding: builders.mutation({
      query: ({ name, buildingId }) => ({
        url: "/v1/buildings/:buildingId",
        method: "PUT",
        data: { name, buildingId },
      }),
    }),
  }),
});

export const { useGetBuildingsQuery } = buildingApi;
