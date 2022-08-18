import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { DeviceDetail, Device, Pagination } from "../types/store";

import { urlBuilder } from '../utils';

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
        query?: string;
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
    getDeviceDetail: builders.query<DeviceDetail, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `v1/devices/${deviceId}`,
      }),
      providesTags: ['Device'],
    }),
  }),
});

export const { useGetDevicesQuery, useGetDeviceDetailQuery, useLazyGetDevicesQuery } = deviceApi;
