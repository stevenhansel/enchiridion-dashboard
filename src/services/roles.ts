import { createApi } from '@reduxjs/toolkit/query/react';

import axios from '../utils/axiosInstance';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: axios(),
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        url: '/v1/roles'
      }),
    }),
  }),
})

export const {
  useGetRolesQuery,
} = rolesApi;
