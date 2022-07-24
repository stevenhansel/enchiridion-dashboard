import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getAnnouncements: builders.query({
      query: () => ({
        url: "/v1/announcements",
      }),
    }),
    getAnnouncementMedia: builders.query({
      query: ({ announcementId }) => ({
        url: `/v1/announcements/${announcementId}/media`,
      }),
    }),
    getAnnouncementsDetail: builders.query({
      query: () => ({
        url: "/v1/announcements/:announcementId",
      }),
    }),
    createAnnouncement: builders.mutation({
      query: ({ formData }) => ({
        url: "/v1/announcements",
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }),
    }),
  }),
});

export const { useGetAnnouncementsQuery, useGetAnnouncementMediaQuery } = announcementApi;
