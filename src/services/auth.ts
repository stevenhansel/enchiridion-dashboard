import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axios(),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: () => ({
        url: "/v1/auth/register",
        method: "POST",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/v1/auth/login",
        method: "POST",
        data: { email, password },
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "/v1/auth/logout",
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
      query: ({token, newPassword}) => ({
        url: "/v1/auth/change-password",
        method: "PUT",
        data: { token, newPassword }
      })
    })
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutQuery, useEmailVerificationQuery } =
  authApi;
