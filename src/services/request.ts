import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getRequests: builders.query({
      query: () => ({
        url: "/v1/requests",
      }),
    }),
  }),
});

export const { useGetRequestsQuery } = requestApi;
