import React from "react";

import {
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

import { ApiErrorResponse } from "../services/error";
import { useGetAnnouncementMediaQuery } from "../services/announcement";

type Props = {
  announcementId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const ViewAnnouncementImageModal = (props: Props) => {
  const { announcementId, open, setOpen } = props;
  const { data, isLoading, error } = useGetAnnouncementMediaQuery({ announcementId }, {
    skip: announcementId === '',
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <>
            {data && 'media' in data && (
              <img alt="announcement-media" src={data.media} style={{width: "100%"}} />
            )}
            {error && 'data' in error && (
              <Typography>
                {(error.data as ApiErrorResponse).messages[0]}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewAnnouncementImageModal;
