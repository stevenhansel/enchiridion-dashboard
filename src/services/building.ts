import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";
import { urlBuilder } from "../utils";

import { Building, UpdateBuilding } from "../types/store";

export const buildingApi = createApi({
  reducerPath: "buildingApi",
  baseQuery: axios(),
  tagTypes: ["Building"],
  endpoints: (builders) => ({
    getBuildings: builders.query<Building[], null>({
      query: (params) => ({
        url: urlBuilder("/v1/buildings", params),
      }),
      providesTags: () => ["Building"],
      transformResponse: (response) =>
        response.contents.map((content: Building) => ({
          id: content.id,
          name: content.name,
          color: content.color,
        })),
    }),
    createBuilding: builders.mutation({
      query: ({ name, color }) => ({
        url: "/v1/buildings",
        method: "POST",
        data: { name, color },
      }),
      invalidatesTags: () => ["Building"],
    }),
    updateBuilding: builders.mutation<
      UpdateBuilding,
      { name: string; buildingId: string; color: string }
    >({
      query: ({ name, buildingId, color }) => ({
        url: `/v1/buildings/${buildingId}`,
        method: "PUT",
        data: { name, buildingId, color },
      }),
      invalidatesTags: () => ["Building"],
    }),
  }),
});

export const {
  useGetBuildingsQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
} = buildingApi;
