import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import {
  Request,
  Action,
  Pagination,
  ActionCreateRequest,
} from "../types/store";

import { urlBuilder } from "../utils";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: axios(),
  tagTypes: ["Request"],
  endpoints: (builders) => ({
    getRequests: builders.query<
      Pagination<Request>,
      {
        page?: number;
        limit?: number;
        requestId?: number | null;
        userId?: number | null;
        announcementId?: number | null;
        actionType?: string | null;
        approvedByLsc?: boolean | null;
        approvedByBm?: boolean | null;
      } | null
    >({
      query: (params) => ({ url: urlBuilder("/v1/requests", params) }),
      providesTags: () => ["Request"],
      transformResponse: (response) => ({
        hasNext: response.hasNext,
        count: response.count,
        totalPages: response.totalPages,
        contents: response.contents,
      }),
    }),
    approveRejectRequest: builders.mutation<
      Action,
      { requestId: string; requestStatus: boolean }
    >({
      query: ({ requestId, requestStatus }) => ({
        url: `/v1/requests/${requestId}/approval`,
        method: "PUT",
        data: { action: requestStatus ? "approve" : "reject" },
      }),
      invalidatesTags: () => ["Request"],
    }),
    createRequest: builders.mutation<
      ActionCreateRequest,
      {
        action: string;
        announcementId: number;
        description: string | null;
        extendedEndDate: string | null;
        newDeviceIds: number[] | null;
      }
    >({
      query: ({
        action,
        announcementId,
        description,
        extendedEndDate,
        newDeviceIds,
      }) => ({
        url: "/v1/requests",
        method: "POST",
        data: { action, announcementId, description, extendedEndDate, newDeviceIds },
      }),
      invalidatesTags: () => ["Request"],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useApproveRejectRequestMutation,
  useLazyGetRequestsQuery,
  useCreateRequestMutation,
} = requestApi;
