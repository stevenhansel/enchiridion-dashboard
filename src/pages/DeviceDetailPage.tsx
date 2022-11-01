import React, { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import {
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { useGetDeviceDetailQuery } from "../services/device";

import Layout from "../components/Layout";
import UpdateDeviceModal from "../components/UpdateDeviceModal";
import DeleteDeviceModal from "../components/DeleteDeviceModal";
import AnnouncementOnDeviceDetail from "../components/AnnouncementOnDeviceDetail";

import { usePermission } from "../hooks";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

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

  const isLoading = isDeviceDetailLoading;

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  return (
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
  );
};

export default DeviceDetailPage;
