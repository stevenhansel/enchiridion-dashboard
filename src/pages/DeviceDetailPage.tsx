import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Paper,
  Card,
  CardActions,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { useGetDeviceDetailQuery } from "../services/device";
import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import Layout from "../components/Layout";
import UpdateDeviceModal from "../components/UpdateDeviceModal";
import DeleteDeviceModal from "../components/DeleteDeviceModal";

import { usePermission } from "../hooks";
import { statusActions } from "../types/constants";
import { ApiErrorResponse } from "../services/error";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [page, setPage] = useState(1);
  const { deviceId = "" } = useParams();
  const hasUpdateDevicePermission = usePermission("update_device");
  const hasDeleteDevicePermission = usePermission("delete_device");

  const { data: devices, isLoading: isDeviceDetailLoading } =
    useGetDeviceDetailQuery(
      { deviceId },
      {
        skip: deviceId === "",
      }
    );

  const [
    getAnnouncements,
    {
      data: announcements,
      error: isAnnouncementsError,
      isLoading: isAnnouncementsLoading,
    },
  ] = useLazyGetAnnouncementsQuery();

  const isLoading = isAnnouncementsLoading && isDeviceDetailLoading;

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!announcements) return true;

    return page === announcements.totalPages;
  }, [page, announcements]);

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    []
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    []
  );

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

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  return (
    <Layout>
      <Box>
        {!isLoading ? (
          <>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h5" fontWeight="bold">
                {devices?.name}
              </Typography>

              <Box>
                {hasUpdateDevicePermission ? (
                  <IconButton
                    onClick={() => {
                      setOpenUpdateModal(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : null}
                {hasDeleteDevicePermission ? (
                  <IconButton
                    onClick={() => {
                      setOpenDeleteModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </Box>
            </Box>
            <Box display="flex" justifyContent="center">
              <Box sx={{ marginTop: 8 }}>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography display="flex" fontWeight="bold">
                    ID
                  </Typography>
                  <Typography>{deviceId}</Typography>
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography fontWeight="bold">Location</Typography>
                  <Typography>{devices?.location}</Typography>
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography fontWeight="bold">Deskripsi</Typography>
                  <Typography>{devices?.description}</Typography>
                </Box>
              </Box>

              <Box sx={{ marginTop: 8, marginLeft: 40 }}>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography fontWeight="bold">Created at</Typography>
                  <Typography>{toDate(devices?.createdAt)}</Typography>
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography fontWeight="bold">Updated at</Typography>
                  <Typography>{toDate(devices?.updatedAt)}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h5"
                fontWeight="bold"
              >
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
                          variant={
                            actionType === action.value ? "contained" : "text"
                          }
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
                    sx={{ marginRight: 1 }}
                  >
                    {announcements.contents.map((announcement) => (
                      <Paper
                        key={announcement.id}
                        elevation={3}
                        sx={{ marginRight: 1, width: "100%" }}
                      >
                        <Box display="flex" justifyContent="center">
                          <img
                            src={announcement.media}
                            style={{ width: "100%", margin: "auto" }}
                          />
                        </Box>
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
                          <Typography>
                            by&nbsp;{announcement.author.name}
                          </Typography>
                          <Typography sx={{ marginRight: "10px" }}>
                            {dayjs(announcement.startDate).format(
                              "D MMMM YYYY"
                            )}
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
            </Box>

            <Dialog
              open={openUpdateModal}
              onClose={() => {
                setOpenUpdateModal(false);
              }}
            >
              <DialogTitle>Update {devices?.name}</DialogTitle>
              <DialogContent>
                <UpdateDeviceModal
                  open={openUpdateModal}
                  setOpen={setOpenUpdateModal}
                  deviceName={devices?.name}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDeleteModal}
              onClose={() => {
                setOpenDeleteModal(false);
              }}
            >
              <DialogTitle>Delete {devices?.name}</DialogTitle>
              <DialogContent>
                <DeleteDeviceModal
                  setOpen={setOpenDeleteModal}
                  deviceName={devices?.name}
                  deviceId={devices?.id}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        )}
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Layout>
  );
};

export default DeviceDetailPage;
