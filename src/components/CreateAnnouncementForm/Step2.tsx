import React, { useCallback, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useFormikContext } from "formik";
import cloneDeep from "lodash/cloneDeep";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues, type FormDevice } from "./form";
import { validateFormikFields } from "./util";

const fields = ["devices"];

const Step2 = () => {
  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { errors, touched, validateField, setFieldValue, values } = formik;
  const { handleNextStep, handlePrevStep } = useContext(
    CreateAnnouncementFormContext
  );

  const _ = useCallback(
    (selectedDevice: FormDevice) => {
      const selectedDeviceIndex = values.devices.findIndex(
        (device) => device.deviceId === selectedDevice.deviceId
      );

      let updatedDevices = cloneDeep(values.devices);

      if (selectedDeviceIndex !== -1) {
        updatedDevices.splice(selectedDeviceIndex, 1);
      } else {
        updatedDevices.push(selectedDevice);
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
    <Box display="flex" flexDirection="row">
      <Box sx={{ marginRight: 2, height: 300, width: 300 }}>
      </Box>
      <Box>
        <Box display="flex" flexDirection="row">
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
            <Typography variant="caption" color={red[700]} fontSize="">
              {errors.devices}
            </Typography>
          ) : null}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: 1 }}
          >
            <Button
              variant="contained"
              sx={{ marginRight: 1 }}
              onClick={handlePrevSubmission}
            >
              Previous
            </Button>
            <Button variant="contained" onClick={handleNextSubmission}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Step2;
