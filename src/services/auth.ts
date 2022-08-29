import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";
import { RegisterForm } from "../types/store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axios(),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation<
      RegisterForm,
      { name: string; email: string; password: string; reason: string; role: string | null; }
    >({
      query: ({ name, email, password, reason, role }) => ({
        url: "/v1/auth/register",
        method: "POST",
        data: { name, email, password, reason, role },
      }),
      invalidatesTags: () => ["Auth"],
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/v1/auth/login",
        method: "POST",
        data: { email, password },
      }),
      invalidatesTags: () => ["Auth"],
    }),
    logout: builder.query<null, null>({
      query: () => ({
        url: "/v1/logout",
      }),
      providesTags: () => ["Auth"],
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/v1/auth/refresh",
        method: "PUT",
      }),
      invalidatesTags: () => ["Auth"],
    }),
    emailVerification: builder.query({
      query: ({ email }) => ({
        url: `/v1/auth/verification/${email}`,
      }),
      providesTags: () => ["Auth"],
    }),
    confirmEmail: builder.mutation({
      query: ({ token }) => ({
        url: "/v1/auth/verification",
        method: "PUT",
        data: { token },
      }),
      invalidatesTags: () => ["Auth"],
    }),
    forgotPassword: builder.query({
      query: () => ({
        url: "/v1/auth/forgot-password",
      }),
      providesTags: () => ["Auth"],
    }),
    changePassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/v1/auth/change-password",
        method: "PUT",
        data: { token, newPassword },
      }),
      invalidatesTags: () => ["Auth"],
    }),
    me: builder.query({
      query: () => ({
        url: "/v1/me",
      }),
      providesTags: () => ["Auth"],
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
