import { createApi } from "@reduxjs/toolkit/query/react";

import axios from "../utils/axiosInstance";

import { Announcement } from '../types/store';

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: axios(),
  endpoints: (builders) => ({
    getAnnouncements: builders.query<Record<number, Announcement>, null>({
      query: () => ({
        url: "/v1/announcements",
      }),
      transformResponse: (response) => response.contents.reduce(
        (prev: Record<number, Announcement>, curr: Announcement) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {},
      )
    }),
    getAnnouncementMedia: builders.query({
      query: ({ announcementId }) => ({
        url: `/v1/announcements/${announcementId}/media`,
      }),
    }),
    getAnnouncementDetail: builders.query<Announcement, { announcementId: string }>({
      query: ({ announcementId }) => ({
        url: `/v1/announcements/${announcementId}`,
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

export const { useGetAnnouncementsQuery, useGetAnnouncementMediaQuery, useGetAnnouncementDetailQuery } = announcementApi;
