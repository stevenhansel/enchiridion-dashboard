import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import Link from "@mui/material/Link";

import { useGetDevicesQuery } from "../services/device";

type Props = {
  children?: React.ReactNode;
};

const DevicePage = (props: Props) => {
  const navigate = useNavigate();

  const {
    data: deviceHash,
    isLoading,
  } = useGetDevicesQuery(null);

  const handleNavigateToDetailPage = (deviceId: number) => {
    navigate(`/device/detail/${deviceId}`);
  };

  return (
    <Box>
      {!isLoading ? (
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
                  {deviceHash &&
                    Object.entries(deviceHash).map(([deviceId, device]) => (
                      <TableRow
                        key={deviceId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          <Link
                            onClick={() =>
                              handleNavigateToDetailPage(device.id)
                            }
                          >
                            {device.id}
                          </Link>
                        </TableCell>
                        <TableCell align="center">{device.name}</TableCell>
                        <TableCell align="center">{device.location}</TableCell>
                        <TableCell align="center">
                          {device.activeAnnouncements}
                        </TableCell>
                        <TableCell align="center">
                          {device.description}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default DevicePage;
