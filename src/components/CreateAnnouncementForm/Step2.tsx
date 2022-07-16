import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableHead,
  ToggleButton,
  Paper,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useFormikContext } from "formik";
import cloneDeep from "lodash/cloneDeep";

import { CreateAnnouncementFormContext } from "./context";
import { CreateAnnouncementFormValues, type FormDevice } from "./form";
import { validateFormikFields } from "./util";

const fields = ["devices"];

type Data = {
  id: number;
  name: string;
  devices: {
    id: number;
    name: string;
  }[];
};

type campusData = {
  campusId: number;
  campus: string;
};

const mockDevices: Data[] = [
  {
    id: 1,
    name: "Lantai 1",
    devices: [
      {
        id: 1,
        name: "Device 1",
      },
      {
        id: 2,
        name: "Device 2",
      },
      {
        id: 3,
        name: "Device 3",
      },
      {
        id: 4,
        name: "Device 4",
      },
      {
        id: 5,
        name: "Device 5",
      },
    ],
  },
  {
    id: 2,
    name: "Lantai 2",
    devices: [
      {
        id: 6,
        name: "Device 6",
      },
      {
        id: 7,
        name: "Device 7",
      },
      {
        id: 8,
        name: "Device 8",
      },
      {
        id: 9,
        name: "Device 9",
      },
      {
        id: 10,
        name: "Device 10",
      },
    ],
  },
  {
    id: 3,
    name: "Lantai 3",
    devices: [
      {
        id: 11,
        name: "Device 11",
      },
      {
        id: 12,
        name: "Device 12",
      },
      {
        id: 13,
        name: "Device 13",
      },
      {
        id: 14,
        name: "Device 14",
      },
      {
        id: 15,
        name: "Device 15",
      },
    ],
  },
];

const mockCampuses: campusData[] = [
  {
    campusId: 1,
    campus: "Anggrek",
  },
  {
    campusId: 2,
    campus: "Syahdan",
  },
  {
    campusId: 3,
    campus: "Alam Sutera",
  },
  {
    campusId: 4,
    campus: "Bandung",
  },
  {
    campusId: 5,
    campus: "Malang",
  },
  {
    campusId: 6,
    campus: "Medan",
  },
];

const Step2 = () => {
  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { errors, touched, validateField, setFieldValue, values } = formik;
  const { handleNextStep, handlePrevStep } = useContext(
    CreateAnnouncementFormContext
  );
  const [listDevices] = useState<Data[]>(mockDevices);

  const [listCampuses] = useState<campusData[]>(mockCampuses);

  const handleDeviceSelect = useCallback(
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
    console.log("errors", errors);
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
        {listCampuses.map((row) => (
          <TableRow
            key={row.campusId}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <Box display="flex" justifyContent="center" sx={{marginBottom: 1}}>
              <ToggleButton value={row.campusId}>{row.campus}</ToggleButton>
            </Box>
          </TableRow>
        ))}
      </Box>
      <Box>
        <Box display="flex" flexDirection="row">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow></TableRow>
              </TableHead>
              <TableBody>
                {listDevices.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell
                      align="justify"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {row.devices.map((device) => (
                        <TableRow
                          key={device.id}
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <ToggleButton
                              value={device.id}
                              selected={values.devices.some(
                                ({ deviceId }) => deviceId === device.id
                              )}
                              onChange={() =>
                                handleDeviceSelect({
                                  deviceId: device.id,
                                  deviceName: device.name,
                                  floorName: row.name,
                                })
                              }
                            >
                              {device.name}
                            </ToggleButton>
                          </Box>
                        </TableRow>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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