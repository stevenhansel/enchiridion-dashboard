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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useGetDeviceDetailQuery } from "../services/device";
import Layout from "../components/Layout";
import UpdateDeviceModal from "../components/UpdateDeviceModal";

import { usePermission } from "../hooks";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const DeviceDetailPage = () => {
  const [open, setOpen] = useState(false);
  const { deviceId = "" } = useParams();
  const hasUpdateDevicePermission = usePermission("update_device");
  const hasDeleteDevicePermission = usePermission("delete_device");

  const { data: devices } = useGetDeviceDetailQuery(
    { deviceId },
    {
      skip: deviceId === "",
    }
  );

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
          <Typography variant="h5" fontWeight="bold">
            Announcement
          </Typography>
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
