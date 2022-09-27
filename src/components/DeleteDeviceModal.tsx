import React from "react";
import { Typography, Button, Box } from "@mui/material";

import { useDeleteDeviceMutation } from "../services/device";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceName?: string;
  deviceId?: number;
};

const DeleteDeviceModal = (props: Props) => {
  const { setOpen, deviceName, deviceId } = props;
  const [deleteDevice] = useDeleteDeviceMutation();

  return (
    <Box>
      <Typography sx={{ marginBottom: 1 }}>
        Are you sure want to delete {deviceName}?
      </Typography>
      <Button
        variant="contained"
        onClick={() => deleteDevice(deviceId)}
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
    </Box>
  );
};

export default DeleteDeviceModal;
