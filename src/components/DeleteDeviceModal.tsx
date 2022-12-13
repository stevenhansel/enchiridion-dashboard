import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useDeleteDeviceMutation } from "../services/device";
import { isApiError, isReduxError } from "../services/error";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceName?: string;
  deviceId?: number;
};

const DeleteDeviceModal = (props: Props) => {
  const { setOpen, deviceName, deviceId } = props;
  const navigate = useNavigate();
  const [deletedDevice, setDeletedDevice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteDevice] = useDeleteDeviceMutation();

  const handleDelete = async (deviceId?: number) => {
    try {
      await deleteDevice({ deviceId }).unwrap();
      setDeletedDevice(true);
    } catch (err) {
      if (isReduxError(err) && isApiError(err.data)) {
        const { errorCode, messages } = err.data;
        const [message] = messages;
        if (errorCode === "DEVICE_NOT_FOUND") {
          setErrorMessage(message);
        } else if (errorCode === "DEVICE_DELETE_CONFLICT") {
          setErrorMessage(message);
        }
        setDeletedDevice(false);
      }
    }
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  return (
    <Box>
      {deletedDevice ? (
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Typography sx={{ marginBottom: 1 }}>Delete Success</Typography>
          <Button
            variant="contained"
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate('/device');
            }}
          >
            Ok
          </Button>
        </Box>
      ) : (
        <>
          <Typography sx={{ marginBottom: 1 }}>
            Are you sure want to delete {deviceName}?
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleDelete(deviceId)}
            sx={{ marginRight: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </>
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

export default DeleteDeviceModal;
