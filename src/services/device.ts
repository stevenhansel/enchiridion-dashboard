import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { DeviceDetail, Device, Pagination, UpdateDevice } from "../types/store";

import { urlBuilder } from "../utils";

export const deviceApi = createApi({
  reducerPath: "deviceApi",
  baseQuery: axios(),
  tagTypes: ["Device"],
  endpoints: (builders) => ({
    getDevices: builders.query<
      Pagination<Device>,
      {
        page?: number;
        limit?: number;
        query?: string | null;
      } | null
    >({
      query: (params) => ({ url: urlBuilder("/v1/devices", params) }),
      providesTags: () => ["Device"],
      transformResponse: (response) => ({
        hasNext: response.hasNext,
        count: response.count,
        totalPages: response.totalPages,
        contents: response.contents,
      }),
    }),
    updateDevice: builders.mutation<
      UpdateDevice,
      {
        name: string;
        description: string;
        deviceId: string;
        floorId: number | null;
      }
    >({
      query: ({ name, description, deviceId, floorId }) => ({
        url: `v1/devices/${deviceId}`,
        method: "PUT",
        data: { name, description, floorId, deviceId },
      }),
      invalidatesTags: () => ["Device"],
    }),
    getDeviceDetail: builders.query<DeviceDetail, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `v1/devices/${deviceId}`,
      }),
      providesTags: () => ["Device"],
    }),
    createDevice: builders.mutation({
      query: ({ name, description, floorId }) => ({
        url: "v1/devices",
        method: "POST",
        data: { name, description, floorId },
      }),
      invalidatesTags: () => ["Device"],
    }),
    deleteDevice: builders.mutation({
      query: ({ deviceId }) => ({
        url: `v1/devices/${deviceId}`,
        method: "DELETE",
        data: { deviceId },
      }),
      invalidatesTags: () => ["Device"],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceDetailQuery,
  useLazyGetDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
} = deviceApi;
