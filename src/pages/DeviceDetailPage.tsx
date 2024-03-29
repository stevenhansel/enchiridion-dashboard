import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useWebSocket from 'react-use-websocket';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useGetDeviceDetailQuery } from '../services/device';
import { useLazyGetAnnouncementsQuery } from '../services/announcement';
import UpdateDeviceModal from '../components/UpdateDeviceModal';
import DeleteDeviceModal from '../components/DeleteDeviceModal';
import AnnouncementOnDeviceDetail from '../components/AnnouncementOnDeviceDetail';
import { usePermission } from '../hooks';
import config from '../config';
import DeviceStatus, { DeviceState } from '../components/DeviceStatus';
import RealtimeChart, {
  realtimeChartDateFormat,
} from '../components/RealtimeChart';
import MaximumChart from '../components/MaximumChart';
import LivestreamCam from '../components/LivestreamCam';

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format('DD MMM YYYY h:mm A');

const DeviceDetailPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { deviceId = '' } = useParams();
  const hasUpdateDevicePermission = usePermission('update_device');
  const hasDeleteDevicePermission = usePermission('delete_device');
  const hasViewAnnouncementListPermission = usePermission(
    'view_list_announcement'
  );

  const { data: devices } = useGetDeviceDetailQuery(
    { deviceId },
    {
      skip: deviceId === '',
    }
  );

  const [getAnnouncements, { data: announcements }] =
    useLazyGetAnnouncementsQuery();

  const [realtimeChartData, setRealtimeChartData] = useState<
    { x: string; y: number }[]
  >([]);

  const { lastMessage: deviceStatusMessage } = useWebSocket(
    `${config.wssBaseUrl}/v1/device_status/${deviceId}`
  );
  const { lastMessage: livestreamMessage } = useWebSocket(
    `${config.wssBaseUrl}/v1/livestream/${deviceId}`
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  useEffect(() => {
    if (livestreamMessage !== null) {
      const livestreamData = JSON.parse(livestreamMessage.data);

      setRealtimeChartData(previousData => {
        let updatedData = previousData;
        if (previousData.length === 60) {
          updatedData = previousData.slice(1);
        }

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
      {announcements && announcements.contents.length > 0 ? (
        <Box>
          <Box display="flex" justifyContent="center">
            <Typography fontWeight="bold" variant="h4">
              {devices?.name}
            </Typography>
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
                <Typography fontWeight="bold">Description Locations</Typography>
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
              <UpdateDeviceModal setOpen={setOpenUpdateModal} />
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
        onClose={() => setErrorMessage('')}
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
      {devices && devices.cameraEnabled ? (
        <Box>
          <Box>
            <Typography
              sx={{ marginTop: 5, marginBottom: 1 }}
              variant="h5"
              fontWeight="bold"
            >
              Livestream
            </Typography>

            <LivestreamCam deviceId={deviceId} />
          </Box>
          <>
            <Box>
              {realtimeChartData.length > 0 ? (
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ marginBottom: 1 }}
                  >
                    Realtime Chart
                  </Typography>
                  <RealtimeChart
                    chartId="livestream"
                    chartData={realtimeChartData}
                  />
                </>
              ) : null}
            </Box>
            <Box>
              <MaximumChart deviceId={deviceId} />
            </Box>
            {/* <Box>
              <AverageChart deviceId={deviceId} />
            </Box> */}
          </>
        </Box>
      ) : null}
    </Box>
  );
};

export default DeviceDetailPage;
