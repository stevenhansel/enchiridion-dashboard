import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Announcement } from "../types/store";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: axios(),
  tagTypes: ["Announcement"],
  endpoints: (builders) => ({
    getAnnouncements: builders.query<
      Record<number, Announcement>,
      { deviceId: number | null } | null
    >({
      query: (params) => {
        let url = "/v1/announcements";
        if (params !== null) {
          const { deviceId } = params;

          if (deviceId !== null) {
            url += `?deviceId=${deviceId}`;
          }
        }
        return { url };
      },
      providesTags: () => ["Announcement"],
      transformResponse: (response) =>
        response.contents.reduce(
          (prev: Record<number, Announcement>, curr: Announcement) => ({
            ...prev,
            [curr.id]: curr,
          }),
          {}
        ),
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
} = announcementApi;
