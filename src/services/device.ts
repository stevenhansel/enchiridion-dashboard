import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { DeviceDetail, Device } from "../types/store";

export const deviceApi = createApi({
  reducerPath: "deviceApi",
  baseQuery: axios(),
  tagTypes: ["Device"],
  endpoints: (builders) => ({
    getDevices: builders.query<Record<number, Device>, null>({
      query: () => ({
        url: "/v1/devices",
      }),
      providesTags: ['Device'],
      transformResponse: (response) =>
        response.contents.reduce(
          (prev: Record<number, Device>, curr: Device) => ({
            ...prev,
            [curr.id]: curr,
          }),
          {}
        ),
    }),
    getDeviceDetail: builders.query<DeviceDetail, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `v1/devices/${deviceId}`,
      }),
      providesTags: ['Device'],
    }),
  }),
});

export const { useGetDevicesQuery, useGetDeviceDetailQuery } = deviceApi;
