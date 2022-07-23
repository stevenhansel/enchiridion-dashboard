import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const deviceApi = createApi({
  reducerPath: "deviceApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getDevices: builders.query({
      query: () => ({
        url: "/v1/devices",
      }),
    }),
    getDeviceDetail: builders.query({
      query: () => ({
        url: 'v1/devices/:devicesId'
      }),
    }),
  }),
});

export const { useGetDevicesQuery } = deviceApi;
