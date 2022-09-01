import React, { useState, useEffect } from "react";

import { Box, Card, IconButton, Typography, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { useDeleteBuildingMutation } from "../services/building";
import { useGetBuildingsQuery } from "../services/building";

import { ApiErrorResponse } from "../services/error";

const DeleteBuilding = () => {
  const { data: buildings, isLoading, error } = useGetBuildingsQuery(null);
  const [deleteBuilding, { error: isDeleteBuildingError }] =
    useDeleteBuildingMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = (buildingId: number) => {
    deleteBuilding({ buildingId });
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  useEffect(() => {
    if (isDeleteBuildingError && "data" in isDeleteBuildingError) {
      setErrorMessage(
        (isDeleteBuildingError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isDeleteBuildingError]);

  return (
    <>
      <Box>
        <Box display="flex" flexDirection="column">
          {buildings &&
            buildings.map((building) => (
              <Box sx={{ marginBottom: 1 }}>
                <Card sx={{ backgroundColor: building.color }}>
                  <Box
                    key={building.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight="bold">{building.name}</Typography>
                    <IconButton onClick={() => handleDelete(building.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Box>
            ))}
        </Box>
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={handleClose}
          message={errorMessage}
          action={action}
        />
      </Box>
    </>
  );
};

export default DeleteBuilding;
