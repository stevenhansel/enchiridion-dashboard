import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Snackbar,
  CardActions,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
} from '../services/building';
import { ApiErrorResponse } from '../services/error';

type Props = {
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
};

const DeleteBuilding = (props: Props) => {
  const { setSuccessMessage } = props;
  const {
    data: buildings,
    isLoading: isGetBuildingsLoading,
    error: isGetBuildingsError,
  } = useGetBuildingsQuery(null);
  const [deleteBuilding, { error: isDeleteBuildingError }] =
    useDeleteBuildingMutation();

  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

  const handleDelete = (buildingId: number) => {
    deleteBuilding({ buildingId });
    setSuccessMessage('Delete Building Success');
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  useEffect(() => {
    if (isDeleteBuildingError && 'data' in isDeleteBuildingError) {
      setErrorMessage(
        (isDeleteBuildingError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetBuildingsError && 'data' in isGetBuildingsError) {
      setErrorMessage(
        (isGetBuildingsError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isGetBuildingsError, isDeleteBuildingError]);

  return (
    <>
      {buildings && buildings.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <Typography fontWeight="bold">
            No Buildings Found! Create one first!
          </Typography>
        </Box>
      ) : (
        <>
          {!isGetBuildingsLoading ? (
            <Box>
              {buildings &&
                buildings.map(building => (
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
                        <Typography fontWeight="bold">
                          {deleteConfirmation === building.id
                            ? `Are you sure want to delete ${building.name}?`
                            : building.name}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        {deleteConfirmation === building.id ? (
                          <Tooltip title="Click again to confirm">
                            <IconButton
                              onClick={() => handleDelete(building.id)}
                            >
                              <DeleteIcon
                                sx={{
                                  color: 'red',
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <IconButton
                            onClick={() => setDeleteConfirmation(building.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </CardActions>
                  </Card>
                ))}
              <Box>
                <Snackbar
                  open={Boolean(errorMessage)}
                  autoHideDuration={6000}
                  onClose={() => setErrorMessage('')}
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
      )}
    </>
  );
};

export default DeleteBuilding;
