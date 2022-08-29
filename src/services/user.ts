import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { User, Pagination } from "../types/store";

import { urlBuilder } from "../utils";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axios(),
  tagTypes: ["User"],
  endpoints: (builders) => ({
    getUsers: builders.query<
      Pagination<User>,
      {
        page?: number;
        limit?: number;
        query?: string;
        status?: string;
      } | null
    >({
      query: (params) => ({
        url: urlBuilder("v1/users", params),
      }),
      providesTags: () => ["User"],
      transformResponse: (response) => ({
        hasNext: response.hasNext,
        count: response.count,
        totalPages: response.totalPages,
        contents: response.contents,
      }),
    }),
  }),
});

export const { useLazyGetUsersQuery } = userApi;
