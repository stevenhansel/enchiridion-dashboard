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
    getAnnouncementsDetail: builders.query({
      query: () => ({
        url: "v1/announcements/:announcementId",
      }),
    }),
  }),
});

export const { useGetAnnouncementsQuery } = announcementApi;
