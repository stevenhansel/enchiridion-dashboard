import React, { useCallback } from "react";
import { Button, Box, Typography } from "@mui/material";

import { useDeleteFloorMutation } from "../services/floor";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  floorId: string;
  floorName: string;
  buildingName: string;
};

const DeleteFloorModal = (props: Props) => {
  const { floorId, floorName, buildingName, setOpen } = props;
  const [deleteFloor] = useDeleteFloorMutation();

  const handleDeleteAnnouncement = useCallback((floorId: string) => {
    deleteFloor({ floorId });
    setOpen(false);
  }, [deleteFloor, setOpen]);

  return (
    <Box>
      <Typography>
        Are you sure you want to delete {floorName} on {buildingName}?
      </Typography>
      <Box sx={{ marginTop: 1 }}>
        <Button
          onClick={() => handleDeleteAnnouncement(floorId)}
          variant="contained"
          sx={{ marginRight: 1 }}
        >
          Delete
        </Button>
        <Button onClick={() => setOpen(false)} variant="contained">
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteFloorModal;
