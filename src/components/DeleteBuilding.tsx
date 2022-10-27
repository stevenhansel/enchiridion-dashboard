import React, { useState, useEffect } from "react";

import {
  Box,
  Card,
  IconButton,
  Typography,
  Snackbar,
  CardActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";

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
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [deleteConfirmationState, setDeleteConfirmationState] = useState(false);

  const handleDelete = (buildingId: number) => {
    deleteBuilding({ buildingId });
  };

  const handleDeleteConfirmation = (buildingId: number) => {
    setDeleteConfirmation(buildingId);
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
                sx={{ backgroundColor: building.color, marginBottom: 1 }}
                key={building.id}
              >
                <CardActions>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                  >
                    {deleteConfirmation === building.id ? (
                      <Typography fontWeight="bold">
                        Are you sure you want to delete {building.name}?
                      </Typography>
                    ) : (
                      <Typography fontWeight="bold">{building.name}</Typography>
                    )}
                  </Box>
                  {deleteConfirmation === building.id ? (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Tooltip title="Click to confirm">
                        <IconButton onClick={() => handleDelete(building.id)}>
                          <DeleteIcon
                            sx={{
                              color: "red",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() => handleDeleteConfirmation(building.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
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
