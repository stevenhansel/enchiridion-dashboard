import { createApi } from '@reduxjs/toolkit/query/react';

import axios from '../utils/axiosInstance';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axios(),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: () => ({
        url: '/v1/auth/register',
        method: 'POST',
      }),
    }),
    login: builder.mutation<any, any>({
      query: ({ email, password }) => ({
        url: '/v1/auth/login',
        method: 'POST',
        data: { email, password },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/customer/session/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
