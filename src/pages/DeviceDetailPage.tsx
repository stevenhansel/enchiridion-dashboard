import React, { useState, useEffect } from "react";
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
import { actions } from "../types/constants";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = () => {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
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

  useEffect(() => {
    getAnnouncements({ populateMedia: true, deviceId: deviceId });
  }, [getAnnouncements]);

  console.log(announcements);

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography align="center" variant="h5" fontWeight="bold">
            {devices?.name}
          </Typography>
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
          <Box sx={{ marginBottom: 1, width: "600px" }}>
            <Card sx={{ bgcolor: "#D2E4EF" }}>
              <CardActions>
                {actions &&
                  actions.map((action, index) => (
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
          <Box>
            {announcements &&
              announcements.contents.map((announcement) => (
                <Box
                  key={announcement.id}
                  display="flex"
                  sx={{ marginBottom: 1 }}
                >
                  <Paper elevation={3}>
                    <img src={announcement.media} style={{ margin: "10px" }} />
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ marginLeft: "10px" }}
                    >
                      {announcement.title}
                    </Typography>
                    <Button variant="contained" sx={{ marginBottom: 1, marginLeft: "10px" }}>
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
                </Box>
              ))}
          </Box>
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
