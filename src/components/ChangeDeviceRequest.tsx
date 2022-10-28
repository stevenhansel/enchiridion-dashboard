import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import * as yup from "yup";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";

import { useFormik } from "formik";

import { useCreateRequestMutation } from "../services/request";
import { useGetBuildingsQuery } from "../services/building";
import { useGetFloorsQuery } from "../services/floor";
import { useGetAnnouncementDetailQuery } from "../services/announcement";
import { ApiErrorResponse, isApiError, isReduxError } from "../services/error";

import { ActionCreateRequest } from "../types/store";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = yup.object({
  newDeviceIds: yup.array().min(1).required(),
  description: yup.string().required().min(10).max(30),
});

const ChangeDeviceRequest = (props: Props) => {
  const { setOpen } = props;
  const [createRequest, { error }] = useCreateRequestMutation();
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [descriptionConfirmation, setDescriptionConfirmation] = useState(true);

  const { announcementId = "" } = useParams();

  const { data: buildings, isLoading: isBuildingLoading } =
    useGetBuildingsQuery(null);

  const { data: floors, isLoading: isFloorLoading } = useGetFloorsQuery(null);

  const { isLoading: isGetAnnouncementDetailLoading } =
    useGetAnnouncementDetailQuery(
      { announcementId },
      {
        skip: announcementId === "",
      }
    );

  const isLoading =
    isGetAnnouncementDetailLoading || isFloorLoading || isBuildingLoading;

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: "change_devices",
      extendedEndDate: null,
      announcementId: parseInt(announcementId, 10),
      description: "",
      newDeviceIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await createRequest(values).unwrap();
        setOpen(false);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;
          if (errorCode === "DEVICE_NOT_FOUND") {
            setErrorMessage(message);
          } else if (errorCode === "FLOOR_NOT_FOUND") {
            setErrorMessage(message);
          } else if (errorCode === "DEVICE_ALREADY_EXISTS") {
            setErrorMessage(message);
          }
        }
      }
    },
  });

  const handleSelectDevice = useCallback(
    (selectedDeviceId: number) => {
      const selectedDeviceIndex = formik.values.newDeviceIds.findIndex(
        (deviceId) => deviceId === selectedDeviceId
      );

      let updatedDevices = cloneDeep(formik.values.newDeviceIds);

      if (selectedDeviceIndex !== -1) {
        updatedDevices.splice(selectedDeviceIndex, 1);
      } else {
        updatedDevices.push(selectedDeviceId);
      }

      formik.setFieldValue("newDeviceIds", updatedDevices);
    },
    [formik.values, formik.setFieldValue]
  );

  const handleNextStep = () => {
    formik.setFieldTouched("newDeviceIds", true);
    setDescriptionConfirmation(Boolean(formik.errors.newDeviceIds));
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (error && "data" in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  useEffect(() => {
    if (
      buildings !== undefined &&
      isBuildingLoading === false &&
      buildings.length > 0
    ) {
      const firstBuildingId = buildings[0].id;
      setCurrentBuildingId(firstBuildingId.toString());
    }
  }, [buildings]);

  return (
    <>
      {!isLoading ? (
        <form onSubmit={formik.handleSubmit}>
          {descriptionConfirmation ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid #c4c4c4",
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {buildings &&
                    buildings.map((building) => (
                      <Button
                        key={building.id}
                        onClick={() =>
                          setCurrentBuildingId(building.id.toString())
                        }
                        variant={
                          currentBuildingId === building.id.toString()
                            ? "contained"
                            : "text"
                        }
                        color={
                          currentBuildingId === building.id.toString()
                            ? "secondary"
                            : "inactive"
                        }
                        sx={{ marginBottom: 1 }}
                      >
                        {building.name}
                      </Button>
                    ))}
                </Box>
                <Box sx={{ borderLeft: "1px solid #c4c4c4" }} />
                <Box
                  sx={{
                    padding: 3,
                    flex: 1,
                  }}
                >
                  <Box>
                    {floors &&
                      floors?.contents
                        .filter(
                          (floor) =>
                            currentBuildingId === floor.building.id.toString()
                        )
                        .map((floor) => (
                          <Box
                            key={floor.id}
                            display="flex"
                            sx={{
                              border: "1px solid #c4c4c4",
                              marginBottom: 1,
                            }}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                minWidth: 100,
                                marginRight: 1,
                                marginBottom: 2,
                                margin: 1,
                              }}
                            >
                              {floor.name}
                            </Box>
                            <Box sx={{ width: "100%" }}>
                              {floor.devices.map((device) => (
                                <Tooltip
                                  key={device.id}
                                  title={device.description}
                                >
                                  <Button
                                    key={device.id}
                                    onClick={() =>
                                      handleSelectDevice(device.id)
                                    }
                                    variant={
                                      formik.values.newDeviceIds.includes(
                                        device.id
                                      )
                                        ? "contained"
                                        : "outlined"
                                    }
                                    color={
                                      formik.values.newDeviceIds.includes(
                                        device.id
                                      )
                                        ? "secondary"
                                        : "inactive"
                                    }
                                    sx={{ margin: 1, width: 140 }}
                                  >
                                    {device.name}
                                  </Button>
                                </Tooltip>
                              ))}
                            </Box>
                          </Box>
                        ))}
                  </Box>
                </Box>
              </Box>
              {formik.touched.newDeviceIds && formik.errors.newDeviceIds ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="caption" color={red[700]}>
                    select at least 1 device
                  </Typography>
                </Box>
              ) : null}

              <Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleNextStep();
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box>
                <Typography variant="h5" sx={{ marginBottom: 1 }}>
                  Please state your reason why you want to change devices
                </Typography>
                <Typography>Description</Typography>
                <TextField
                  id="description"
                  variant="standard"
                  autoComplete="off"
                  onChange={(e) =>
                    formik.setFieldValue("description", e.target.value)
                  }
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Box>
              <Box>
                <Button variant="contained" type="submit">
                  OK
                </Button>
              </Box>
            </>
          )}

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
        </form>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ChangeDeviceRequest;
