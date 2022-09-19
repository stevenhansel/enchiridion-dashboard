import React, { useState, useEffect, useMemo, useCallback} from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useGetDeviceDetailQuery } from "../services/device";
import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import Layout from "../components/Layout";
import UpdateDeviceModal from "../components/UpdateDeviceModal";

import { usePermission } from "../hooks";
import { statusActions, AnnouncementStatus } from "../types/constants";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = () => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [page, setPage] = useState(1);
  const { deviceId = "" } = useParams();
  const hasUpdateDevicePermission = usePermission("update_device");
  const hasDeleteDevicePermission = usePermission("delete_device");

  const { data: devices } = useGetDeviceDetailQuery(
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
    });
  }, [getAnnouncements, actionType, deviceId, page]);

  return (
    <Layout>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ marginTop: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {devices?.name}
          </Typography>
        </Box>
        <Box>
          {hasUpdateDevicePermission ? (
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          ) : null}
          {hasDeleteDevicePermission ? (
            <IconButton>
              <DeleteIcon />
            </IconButton>
          ) : null}
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
            <Box display="flex" flexDirection="row" sx={{ marginRight: 1, width: "100%" }}>
              {announcements &&
                announcements.contents.map((announcement) => (
                  <Paper elevation={3} sx={{marginRight: 1}}>
                    <img
                      src={announcement.media}
                      style={{ width: "100%", margin:1 }}
                    />
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ marginLeft: "10px" }}
                    >
                      {announcement.title}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ marginBottom: 1, marginLeft: "10px" }}
                    >
                      {announcement.status.label}
                    </Button>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      sx={{ marginBottom: 1, marginLeft: "10px" }}
                    >
                      <Typography>
                        by&nbsp;{announcement.author.name}
                      </Typography>
                      <Typography sx={{ marginRight: "10px" }}>
                        {dayjs(announcement.startDate).format("D MMMM YYYY")}
                        &nbsp;-&nbsp;
                        {dayjs(announcement.endDate).format("D MMMM YYYY")}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
            </Box>
          ) : (
            <Typography>Announcement Not Found!</Typography>
          )}
        </Box>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogTitle>Update {devices?.name}</DialogTitle>
          <DialogContent>
            <UpdateDeviceModal
              open={open}
              setOpen={setOpen}
              deviceName={devices?.name}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default DeviceDetailPage;
