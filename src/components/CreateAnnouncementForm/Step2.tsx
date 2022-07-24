import React, { useCallback, useEffect, useContext, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";

import { RootState } from "../../store";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues } from "./form";
import { validateFormikFields } from "./util";

const fields = ["devices"];

const Step2 = () => {
  const buildingsState = useSelector((state: RootState) => state.buildings);
  const floorsState = useSelector((state: RootState) => state.floors);

  const [currentBuildingId, setCurrentBuildingId] = useState<string>('');

  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { errors, touched, validateField, setFieldValue, values } = formik;
  const { handleNextStep, handlePrevStep } = useContext(
    CreateAnnouncementFormContext
  );

  const handleSelectDevice = useCallback(
    (selectedDeviceId: string) => {
      const selectedDeviceIndex = values.devices.findIndex(
        (deviceId) => deviceId === selectedDeviceId
      );

      let updatedDevices = cloneDeep(values.devices);

      if (selectedDeviceIndex !== -1) {
        updatedDevices.splice(selectedDeviceIndex, 1);
      } else {
        updatedDevices.push(selectedDeviceId);
      }

      setFieldValue("devices", updatedDevices);
    },
    [values, setFieldValue]
  );

  const handleNextSubmission = useCallback(() => {
    const errors = validateFormikFields(formik, fields);
    if (errors.length > 0) return;

    handleNextStep();
  }, [formik, handleNextStep]);

  const handlePrevSubmission = useCallback(() => {
    handlePrevStep();
  }, [handlePrevStep]);

  useEffect(() => {
    fields.forEach((field) => validateField(field));
    // eslint-disable-next-line
  }, []);

  return (
    <Box width="100%">
      <Box
        sx={{
          display: 'flex',
          border: '1px solid #c4c4c4',
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {buildingsState && Object.entries(buildingsState).map(([buildingId, building]) => (
            <Button
              key={buildingId}
              onClick={() => setCurrentBuildingId(buildingId)}
              variant={currentBuildingId === buildingId ? 'contained' : 'text'}
              color={currentBuildingId === buildingId ? 'secondary' : 'inactive'}
              sx={{ marginBottom: 1 }}
            >
              {building.name}
            </Button>
          ))}
        </Box>
        <Box sx={{ borderLeft: '1px solid #c4c4c4' }} />
        <Box
          sx={{
            padding: 3,
            flex: 1,
          }}
        >
          <Box>
            {floorsState && Object.entries(floorsState).filter(([_, floor]) => currentBuildingId === floor.building.id.toString()).map(([floorId, floor]) => (
              <Box
                key={floorId}
                display="flex"
              >
                <Box sx={{ minWidth: 100, flex: 1, marginRight: 1, marginBottom: 2 }}>
                  {floor.name}
                </Box>
                <Box display="flex" flexWrap="wrap">
                  {floor.devices.map((device) => (
                    <Button
                      key={device.id}
                      onClick={() => handleSelectDevice(device.id.toString())}
                      //variant={values.devices.includes(device.id.toString()) ? 'contained' : 'text'}
                      variant="contained"
                      color={values.devices.includes(device.id.toString()) ? 'secondary' : 'inactive'}
                      sx={{ marginRight: 1, marginBottom: 1, width: 140 }}
                    >
                      {device.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {touched.devices &&
        errors.devices &&
        typeof errors.devices === "string" ? (
          <Typography variant="caption" color={red[700]} sx={{ marginTop: 1 }}>
            {errors.devices}
          </Typography>
        ) : null
      }
    </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 7 }}
      >
        <Button
          variant="contained"
          onClick={handlePrevSubmission}
          sx={{ marginRight: 1 }}
        >
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextSubmission}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
