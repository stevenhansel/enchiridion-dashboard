import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateAnnouncementFormContext } from "./context";

import {
  Box,
  Button,
  Stepper,
  TextField,
  Typography,
  TableCell,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableHead,
  Paper,
} from "@mui/material";

type Device = {
  id: number;
  deviceName: string;
  devices: string[];
};

const Step2 = () => {
  const { handleNextStep } = useContext(CreateAnnouncementFormContext);
  const [listDevices, setListDevices] = useState<Device[]>([
    {
      id: 1,
      deviceName: "Lantai 1",
      devices: [
        "Device 1",
        "Device 2",
        "Device 3",
        "Device 4",
        "Device 5",
        "Device 6",
        "Device 7",
        "Device 8",
      ],
    },
    {
      id: 2,
      deviceName: "Lantai 2",
      devices: [
        "Device 1",
        "Device 2",
        "Device 3",
        "Device 4",
        "Device 5",
        "Device 6",
        "Device 7",
        "Device 8",
      ],
    },
    {
      id: 3,
      deviceName: "Lantai 3",
      devices: [
        "Device 1",
        "Device 2",
        "Device 3",
        "Device 4",
        "Device 5",
        "Device 6",
        "Device 7",
        "Device 8",
      ],
    },
  ]);

  return (
    <Box display="flex" flexDirection="column">
      <Box>
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
                  <TableCell align="left">{row.deviceName}</TableCell>
                  <TableCell
                    align="justify"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    {row.devices.map((device) => (
                      <TableRow
                        key={device}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Button
                            variant="outlined"
                            sx={{ marginRight: 1 }}
                          >
                            {device}
                          </Button>
                        </Box>
                      </TableRow>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" onClick={handleNextStep}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step2;
