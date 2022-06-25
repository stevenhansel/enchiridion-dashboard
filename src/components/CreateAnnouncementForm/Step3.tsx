import React, { useState } from "react";

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

const Step3 = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          sx={{
            marginTop: 5,
            bgcolor: "white",
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
          }}
        >
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Title Announcement
            </Typography>
            <Typography>Hari Raya Pengumuman</Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              File Announcement
            </Typography>
            <Typography>1234567.mp4</Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Durasi Hari Announcement
            </Typography>
            <Typography>7 Hari</Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Notes
            </Typography>
            <Typography>Ingin di paling depan</Typography>
          </Box>
          <Typography display="flex" fontWeight="bold">
            Lantai {"&"} Device
          </Typography>
          <Typography>Lantai 1, Device 1</Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained">Next</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3;
