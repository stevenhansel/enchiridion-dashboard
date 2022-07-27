import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Request, Action } from "../types/store";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: axios(),
  tagTypes: ["Request"],
  endpoints: (builders) => ({
    getRequests: builders.query<Record<number, Request>, null>({
      query: () => ({
        url: "/v1/requests",
      }),
      providesTags: () => ['Request'],
      transformResponse: (response) =>
        response.contents.reduce(
          (prev: Record<number, Request>, curr: Request) => ({
            ...prev,
            [curr.id]: curr,
          }),
          {}
        ),
    }),
    createRequest: builders.mutation<Action, { requestId: string, requestStatus: boolean }>({
      query: ({ requestId, requestStatus }) => ({
        url: `/v1/requests/${requestId}/approval`,
        method: "PUT",
        data: { action: requestStatus ? 'approve' : 'reject' }
      }),
      invalidatesTags: () => ['Request'],
    })
  }),
});

export const { useGetRequestsQuery, useCreateRequestMutation } = requestApi;
