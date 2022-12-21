import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardActions,
  Button,
  Paper,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Close as CloseIcon,
} from "@mui/icons-material/";

import dayjs from "dayjs";

import { statusActions } from "../types/constants";

import { useLazyGetAnnouncementsQuery } from "../services/announcement";
import { ApiErrorResponse } from "../services/error";

type Props = {
  deviceId: string;
};

const AnnouncementOnDeviceDetail = (props: Props) => {
  const { deviceId } = props;
  const [errorMessage, setErrorMessage] = useState("");
  const [actionType, setActionType] = useState("");
  const [page, setPage] = useState(1);

  const [
    getAnnouncements,
    {
      data: announcements,
      error: isAnnouncementsError,
      isLoading: isAnnouncementLoading,
    },
  ] = useLazyGetAnnouncementsQuery();

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!announcements) return true;

    return page === announcements.totalPages && announcements.hasNext === false;
  }, [page, announcements]);

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    []
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    []
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    getAnnouncements({
      status: actionType,
      populateMedia: true,
      deviceId: deviceId,
      limit: 3,
      page,
    });
  }, [getAnnouncements, actionType, deviceId, page]);

  useEffect(() => {
    if (isAnnouncementsError && "data" in isAnnouncementsError) {
      setErrorMessage(
        (isAnnouncementsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isAnnouncementsError]);

  return (
    <Box>
      <Typography sx={{ marginBottom: 1 }} variant="h5" fontWeight="bold">
        Announcement
      </Typography>
      <Box sx={{ marginBottom: 1 }}>
        <Card sx={{ bgcolor: "#D2E4EF" }}>
          <CardActions>
            {statusActions &&
              statusActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => setActionType(action.value)}
                  variant={actionType === action.value ? "contained" : "text"}
                  sx={{ marginRight: 2 }}
                  value={actionType}
                >
                  {action.label}
                </Button>
              ))}
          </CardActions>
        </Card>
      </Box>
      {announcements && announcements.contents.length > 0 ? (
        <>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            sx={{ marginRight: 1 }}
          >
            {announcements.contents.map((announcement) => (
              <Paper
                key={announcement.id}
                sx={{ marginRight: 1, width: 395 }}
                elevation={3}
              >
                {!isAnnouncementLoading ? (
                  <Box display="flex" justifyContent="center">
                    {announcement.mediaType === "video" ? (
                      <video
                        src={announcement.media}
                        style={{ width: "100%" }}
                        autoPlay
                        loop
                        muted
                      />
                    ) : (
                      <img
                        src={announcement.media}
                        style={{ width: 395, margin: "auto" }}
                      />
                    )}
                  </Box>
                ) : (
                  <CircularProgress />
                )}

                <Box sx={{ marginLeft: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {announcement.title}
                  </Typography>
                </Box>
                <Box sx={{ marginLeft: 1 }}>
                  <Button variant="contained" sx={{ marginBottom: 1 }}>
                    {announcement.status.label}
                  </Button>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  sx={{ marginLeft: 1, marginBottom: 1 }}
                >
                  <Typography>by&nbsp;{announcement.author.name}</Typography>
                  <Typography sx={{ marginRight: "10px" }}>
                    {dayjs(announcement.startDate).format("D MMMM YYYY")}
                    &nbsp;-&nbsp;
                    {dayjs(announcement.endDate).format("D MMMM YYYY")}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
          <Box
            sx={{ marginTop: 1 }}
            display="flex"
            justifyContent="center"
            flexDirection="row"
          >
            <IconButton
              disabled={isPreviousButtonDisabled}
              onClick={handlePaginationPreviousPage}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Box display="flex" alignItems="center">
              {page}
            </Box>
            <IconButton
              disabled={isNextButtonDisabled}
              onClick={handlePaginationNextPage}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Typography>Announcement Not Found!</Typography>
      )}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </Box>
  );
};

export default AnnouncementOnDeviceDetail;
