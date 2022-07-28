import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Building } from '../types/store';

export const buildingApi = createApi({
  reducerPath: "buildingApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getBuildings: builders.query<Record<number, Building>, null>({
      query: () => ({
        url: "/v1/buildings",
      }),
      transformResponse: (response) => response.contents.reduce(
        (prev: Record<number, Building>, curr: Building) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {},
      ),
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