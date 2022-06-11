import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CreateDeviceForm from "../components/CreateDeviceForm";

type Device = {
  id: number;
  machineId: string;
};

type Props = {
  children?: React.ReactNode;
};

const baseUrl = "https://enchridion-api.stevenhansel.com/dashboard/v1";

const DevicePage = (props: Props) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleNavigateToDetailPage = (deviceId: number) => {
    navigate(`/device/${deviceId}`, { replace: true });
  };

  const fetchDevices = async () => {
    try {
      if (!isLoading) setIsLoading(true);

      const response = await axios.get(baseUrl + "/devices");
      const devices = response.data.contents.map((device: any) => ({
        id: device.id,
        machineId: device.machineId,
      }));

      setDevices(devices);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response.data.message);
    }
  };

  const handleDeviceSave = async () => {
    await fetchDevices();
  };

  console.log(error);

  return (
    <Box>
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography display="flex" justifyContent="center" alignItems="center" variant="h6">
          {error + "!"}
        </Typography>
      )}
      {!isLoading && error === "" && (
        <>
          <CreateDeviceForm onSave={handleDeviceSave} />
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Floor</TableCell>
                    <TableCell align="center">Nums of Announcement</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() => handleNavigateToDetailPage(row.id)}
                        >
                          {row.machineId}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DevicePage;
