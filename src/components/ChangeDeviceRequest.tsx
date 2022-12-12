import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";

import { Box, Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";

import { useCreateRequestMutation } from "../services/request";

import { useGetBuildingsQuery } from "../services/building";
import { useGetFloorsQuery } from "../services/floor";
import { useGetAnnouncementDetailQuery } from "../services/announcement";

import { ApiErrorResponse } from "../services/error";
import { ActionCreateRequest } from "../types/store";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeDeviceRequest = (props: Props) => {
  const [createRequest, { error }] = useCreateRequestMutation();
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const [click, setClick] = useState<number | null>(null);

  const {
    data: buildings,
    error: isGetBuildingError,
    isLoading: isBuildingLoading,
  } = useGetBuildingsQuery(null);

  const {
    data: floors,
    error: isGetFloorError,
    isLoading: isFloorLoading,
  } = useGetFloorsQuery(null);

  const { announcementId = "" } = useParams();

  const { data: announcements, isLoading: isGetAnnouncementDetailLoading } =
    useGetAnnouncementDetailQuery(
      { announcementId },
      {
        skip: announcementId === "",
      }
    );

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: "change_devices",
      extendedEndDate: null,
      announcementId: parseInt(announcementId, 10),
      description: description,
      deviceIds: [],
    },
    onSubmit: (values) => {
      createRequest(values);
      props.setOpen(false);
    },
  });

  const handleSelectDevice = useCallback(
    (selectedDeviceId: number) => {
      const selectedDeviceIndex = formik.values.deviceIds.findIndex(
        (deviceId) => deviceId === selectedDeviceId
      );

      let updatedDevices = cloneDeep(formik.values.deviceIds);

      if (selectedDeviceIndex !== -1) {
        updatedDevices.splice(selectedDeviceIndex, 1);
      } else {
        updatedDevices.push(selectedDeviceId);
      }

      formik.setFieldValue("deviceIds", updatedDevices);
    },
    [formik.values, formik.setFieldValue]
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (description !== null) {
      setDescription("test dulu");
    }
    formik.setFieldValue("description", description);
  }, [description, formik.values.description]);

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
      <form onSubmit={formik.handleSubmit}>
        <Box>
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
                  {floors?.contents
                    .filter(
                      (floor) =>
                        currentBuildingId === floor.building.id.toString()
                    )
                    .map((floor) => (
                      <Box key={floor.id} display="flex">
                        <Box
                          sx={{
                            minWidth: 100,
                            flex: 1,
                            marginRight: 1,
                            marginBottom: 2,
                          }}
                        >
                          {floor.name}
                        </Box>
                        <Box display="flex" flexWrap="wrap">
                          {floor.devices.map((device) => (
                            <Tooltip key={device.id} title={device.description}>
                              <Button
                                variant="contained"
                                onClick={() => handleSelectDevice(device.id)}
                                // color={
                                //   announcements!.devices
                                //     .map(
                                //       (announcementDevice) =>
                                //         announcementDevice.id
                                //     )
                                //     .includes(device.id)
                                //     ? "secondary"
                                //     : "inactive"
                                //       ? "secondary"
                                //       : "inactive"
                                // }
                                color={
                                  formik.values.deviceIds?.includes(device.id)
                                    ? "secondary"
                                    : "inactive"
                                }
                                sx={{
                                  marginRight: 1,
                                  marginBottom: 1,
                                  width: 140,
                                }}
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
            <Box>
              <Button variant="contained" type="submit">
                OK
              </Button>
            </Box>
          </Box>
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
      </form>
    </>
  );
};

export default ChangeDeviceRequest;
