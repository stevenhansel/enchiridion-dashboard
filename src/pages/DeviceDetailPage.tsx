import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import mpegts from "mpegts.js";
import useWebSocket from "react-use-websocket";
import range from "lodash/range";

import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Card,
  CardActions,
} from "@mui/material";

import {
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { useGetDeviceDetailQuery } from "../services/device";
import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import UpdateDeviceModal from "../components/UpdateDeviceModal";
import DeleteDeviceModal from "../components/DeleteDeviceModal";
import AnnouncementOnDeviceDetail from "../components/AnnouncementOnDeviceDetail";

import { usePermission } from "../hooks";
import { statusActions } from "../types/constants";
import config from "../config";
import DeviceStatus, { DeviceState } from "../components/DeviceStatus";
import RealtimeChart, {
  realtimeChartDateFormat,
} from "../components/RealtimeChart";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const now = new Date();

const DeviceDetailPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { deviceId = "" } = useParams();
  const hasUpdateDevicePermission = usePermission("update_device");
  const hasDeleteDevicePermission = usePermission("delete_device");
  const hasViewAnnouncementListPermission = usePermission(
    "view_list_announcement"
  );

  const { data: devices, isLoading: isDeviceDetailLoading } =
    useGetDeviceDetailQuery(
      { deviceId },
      {
        skip: deviceId === "",
      }
    );

  const [getAnnouncements, { data: announcements }] =
    useLazyGetAnnouncementsQuery();

  const [actionType, setActionType] = useState("");
  const [realtimeChartData, setRealtimeChartData] = useState<
    { x: string; y: number }[]
  >(
    range(0, 60).map((num) => ({
      x: dayjs(now).subtract(num, "s").format(realtimeChartDateFormat),
      y: 0,
    }))
  );

  const { lastMessage: deviceStatusMessage } = useWebSocket(
    `${config.wssBaseUrl}/v1/device_status/${deviceId}`
  );
  const { lastMessage: livestreamMessage } = useWebSocket(
    `${config.wssBaseUrl}/v1/livestream/${deviceId}`
  );

  useEffect(() => {
    if (
      devices &&
      devices.cameraEnabled &&
      mpegts.getFeatureList().mseLivePlayback
    ) {
      const videoElement = document.getElementById("device-stream");
      if (videoElement === null) {
        return;
      }

      const player = mpegts.createPlayer(
        {
          type: "flv",
          url: `${config.srsBaseUrl}/live/livestream/${deviceId}.flv`,
          hasAudio: false,
          hasVideo: true,
          isLive: true,
        },
        {
          enableWorker: true,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 10,
        }
      );

      player.attachMediaElement(videoElement as HTMLMediaElement);
      player.load();
      player.play();
    }
  }, [devices, deviceId]);

  const isLoading = isDeviceDetailLoading;

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (livestreamMessage !== null) {
      const livestreamData = JSON.parse(livestreamMessage.data);

      setRealtimeChartData((previousData) => {
        let updatedData = previousData.slice(1);
        updatedData.push({
          x: dayjs(livestreamData.timestamp).format(realtimeChartDateFormat),
          y: livestreamData.numOfFaces,
        });

        return updatedData;
      });
    }
  }, [livestreamMessage]);

  const deviceState = useMemo(() => {
    return deviceStatusMessage !== null
      ? (deviceStatusMessage.data as DeviceState)
      : DeviceState.Loading;
  }, [deviceStatusMessage]);

  useEffect(() => {
    getAnnouncements(null);
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography align="center" variant="h5" fontWeight="bold">
          {devices?.name}
        </Typography>
        {/* {hasUpdateDevicePermission ? (
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
          ) : null} */}
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
            <Typography fontWeight="bold">Description</Typography>
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

          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Device Status</Typography>
            <DeviceStatus state={deviceState} />
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
                  <Typography fontWeight="bold">Description</Typography>
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
            {hasViewAnnouncementListPermission ? (
              <AnnouncementOnDeviceDetail deviceId={deviceId} />
            ) : null}
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
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center"></Box>
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
        {devices?.cameraEnabled ? (
          <Box>
            <Box>
              <Typography
                sx={{ marginTop: 5, marginBottom: 1 }}
                variant="h5"
                fontWeight="bold"
              >
                Livestream
              </Typography>

              <video
                controls
                autoPlay
                style={{ width: 600, height: 450 }}
                id="device-stream"
              />
            </Box>

            <Box>
              <RealtimeChart
                chartId="livestream"
                chartData={realtimeChartData}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DeviceDetailPage;
