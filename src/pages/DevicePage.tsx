import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import Link from '@mui/material/Link';

import CreateDeviceForm from "../components/CreateDeviceForm";

import { AppDispatch } from "../store";

import { deviceApi } from "../services/device";
import { ApiErrorResponse } from "../services";

type Device = {
  id: number;
  name: string;
  location: string;
  activeAnnouncements: string;
  description: string;
};

type Props = {
  children?: React.ReactNode;
};

const DevicePage = (props: Props) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleNavigateToDetailPage = (deviceId: number) => {
    navigate(`/device/${deviceId}`, { replace: true });
  };

  const fetchDevices = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(
      deviceApi.endpoints.getDevices.initiate("")
    );

    if ("data" in response) {
      const getDeviceData: Device[] = response.data.contents.map(
        (data: any) => ({
          id: data.id,
          name: data.name,
          location: data.location,
          activeAnnouncements: data.activeAnnouncements,
          description: data.description,
        })
      );
      setDevices(getDeviceData);
      setIsLoading(false)
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [])

  return (
    <Box>
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
        <>
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
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Active Announcements</TableCell>
                    <TableCell align="center">Descriptions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">
                        <Link onClick={() => handleNavigateToDetailPage(row.id)}>{row.id}</Link>
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.location}</TableCell>
                      <TableCell align="center">{row.activeAnnouncements}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
    </Box>
  );
};

export default DevicePage;
