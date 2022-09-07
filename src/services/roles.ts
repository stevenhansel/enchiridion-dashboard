import { createApi } from '@reduxjs/toolkit/query/react';

import axios from '../utils/axiosInstance';
import { urlBuilder } from '../utils';

import { Role } from '../types/store'

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: axios(),
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], {query: string; limit: number;} | null>({
      query: (params) => ({
        url: urlBuilder('/v1/roles', params)
      }),
      providesTags: () => ["Roles"],
      transformResponse: (response) => response.contents.map((content: Role) => ({
        name: content.name,
        value: content.value,
        description: content.description,
      })) 
    }),
  }),
})

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
} = rolesApi;
