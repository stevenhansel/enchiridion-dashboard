import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Announcement, Pagination, Author } from "../types/store";
import { AnnouncementStatus } from "../types/constants";

import { urlBuilder } from "../utils";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: axios(),
  tagTypes: ["Announcement"],
  endpoints: (builders) => ({
    getAnnouncements: builders.query<
      Pagination<Announcement>,
      {
        page?: number;
        limit?: number;
        query?: string;
        status?: AnnouncementStatus | null,
        userId?: number | null,
        // deviceId?: number;
        // userId?: number;
      } | null
    >({
      query: (params) => ({ url: urlBuilder("/v1/announcements", params) }),
      providesTags: () => ["Announcement"],
      transformResponse: (response) => ({
        hasNext: response.hasNext,
        count: response.count,
        totalPages: response.totalPages,
        contents: response.contents,
      }),
    }),
    getAnnouncementMedia: builders.query({
      query: ({ announcementId }) => ({
        url: `/v1/announcements/${announcementId}/media`,
      }),
      providesTags: () => ["Announcement"],
    }),
    getAnnouncementDetail: builders.query<
      Announcement,
      { announcementId: string }
    >({
      query: ({ announcementId }) => ({
        url: `/v1/announcements/${announcementId}`,
      }),
      providesTags: () => ["Announcement"],
    }),
    createAnnouncement: builders.mutation({
      query: ({ formData }) => ({
        url: "/v1/announcements",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: () => ["Announcement"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementMediaQuery,
  useGetAnnouncementDetailQuery,
  useLazyGetAnnouncementsQuery,
} = announcementApi;
