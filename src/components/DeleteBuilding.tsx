import React, { useState, useEffect } from "react";

import {
  Box,
  Card,
  IconButton,
  Typography,
  Snackbar,
  CardActions,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { useDeleteBuildingMutation } from "../services/building";
import { useGetBuildingsQuery } from "../services/building";

import { ApiErrorResponse } from "../services/error";

const DeleteBuilding = () => {
  const {
    data: buildings,
    isLoading: isGetBuildingsLoading,
    error: isGetBuildingsError,
  } = useGetBuildingsQuery(null);
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

  useEffect(() => {
    if (isDeleteBuildingError && "data" in isDeleteBuildingError) {
      setErrorMessage(
        (isDeleteBuildingError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetBuildingsError && "data" in isGetBuildingsError) {
      setErrorMessage(
        (isGetBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isGetBuildingsError, isDeleteBuildingError]);

  return (
    <>
      {!isGetBuildingsLoading ? (
        <Box>
          {buildings &&
            buildings.map((building) => (
              <Card
                key={building.id}
                sx={{ backgroundColor: building.color, marginBottom: 1 }}
              >
                <CardActions>
                  <Typography fontWeight="bold">{building.name}</Typography>
                  <IconButton onClick={() => handleDelete(building.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          <Box>
            <Snackbar
              open={Boolean(errorMessage)}
              autoHideDuration={6000}
              onClose={() => setErrorMessage("")}
              message={errorMessage}
              action={
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
              }
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default DeleteBuilding;
