import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axios(),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/register",
        method: "POST",
        data,
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/v1/auth/login",
        method: "POST",
        data: { email, password },
      }),
    }),
    logout: builder.query<null, null>({
      query: () => ({
        url: "/v1/logout",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/v1/auth/refresh",
        method: "PUT",
      }),
    }),
    emailVerification: builder.query({
      query: ({ email }) => ({
        url: `/v1/auth/verification/${email}`,
      }),
    }),
    confirmEmail: builder.mutation({
      query: ({ token }) => ({
        url: "/v1/auth/verification",
        method: "PUT",
        data: { token },
      }),
    }),
    forgotPassword: builder.query({
      query: () => ({
        url: "/v1/auth/forgot-password",
      }),
    }),
    changePassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/v1/auth/change-password",
        method: "PUT",
        data: { token, newPassword },
      }),
    }),
    me: builder.query({
      query: () => ({
        url: "/v1/me",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutQuery,
  useLazyLogoutQuery,
  useEmailVerificationQuery,
  useMeQuery,
} = authApi;
