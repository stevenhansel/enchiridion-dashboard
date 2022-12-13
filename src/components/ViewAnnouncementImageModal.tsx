import React, { useState, useEffect } from "react";

import {
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

import { ApiErrorResponse } from "../services/error";
import { useGetAnnouncementMediaQuery } from "../services/announcement";
import { useGetAnnouncementDetailQuery } from "../services/announcement";

type Props = {
  announcementId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewAnnouncementImageModal = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { announcementId, open, setOpen } = props;
  const {
    data: announcementsMedia,
    isLoading: isAnnouncementsMediaLoading,
    error: isAnnouncementsMediaError,
  } = useGetAnnouncementMediaQuery(
    { announcementId },
    {
      skip: announcementId === "",
    }
  );

  const {
    data: announcementsDetail,
    isLoading: isAnnouncementsDetailLoading,
    error: isAnnouncementsDetailError,
  } = useGetAnnouncementDetailQuery(
    { announcementId },
    {
      skip: announcementId === "",
    }
  );

  const media = () => {
    if (announcementsDetail === undefined) {
      return null;
    }
    if (announcementsDetail.mediaType === "video") {
      return (
        <video
          src={announcementsDetail.media}
          style={{ width: "100%" }}
          controls
          autoPlay
          muted
        />
      );
    } else if (announcementsDetail.mediaType === "image") {
      return (
        <img
          alt="announcement-media"
          src={announcementsDetail.media}
          style={{ width: "100%" }}
        />
      );
    }
  };

  const isLoading = isAnnouncementsMediaLoading && isAnnouncementsDetailLoading;

  const error = isAnnouncementsDetailError || isAnnouncementsMediaError;

  useEffect(() => {
    if (isAnnouncementsDetailError && "data" in isAnnouncementsDetailError) {
      setErrorMessage(
        (isAnnouncementsDetailError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isAnnouncementsMediaError && "data" in isAnnouncementsMediaError) {
      setErrorMessage(
        (isAnnouncementsMediaError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isAnnouncementsMediaError, isAnnouncementsDetailError]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <>
            {media()}
            {error ? (
              <Typography>
                {errorMessage}
              </Typography>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewAnnouncementImageModal;
