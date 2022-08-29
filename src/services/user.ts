import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { User, Pagination, Action } from "../types/store";

import { urlBuilder } from "../utils";
import { number } from "yup";

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
        role?: string | null;
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
    approveRejectUser: builders.mutation<
      Action,
      { userId: string; userStatus: boolean }
    >({
      query: ({ userId, userStatus }) => ({
        url: `v1/users/${userId}/approval`,
        method: "PUT",
        data: { action: userStatus ? "approve" : "reject" },
      }),
      invalidatesTags: () => ["User"],
    }),
  }),
});

export const { useLazyGetUsersQuery, useApproveRejectUserMutation } = userApi;
