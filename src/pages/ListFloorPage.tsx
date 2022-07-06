import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

import ListFloorForm from "../components/ListFloorForm";

type Floor = {
  id: number;
  floorName: string;
  devices: string[];
};

type Props = {
  children?: React.ReactNode;
};

const baseUrl = "https://enchridion-api.stevenhansel.com/dashboard/v1";

const ListFloorPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [floors, setFloor] = useState<Floor[]>([
    {
      id: 1,
      floorName: "Lantai 1",
      devices: ["Device 1", "Device 2", "Device 3", "Device 4"],
    },
    {
      id: 2,
      floorName: "Lantai 2",
      devices: ["Device 1", "Device 2", "Device 3", "Device 4", "Device 5"],
    },
    {
      id: 3,
      floorName: "Lantai 3",
      devices: ["Device 1", "Device 2", "Device 3"],
    },
  ]);

  const [open, setOpen] = useState(false);    
  const handleOpenNewFloor = () => setOpen(true);
  const handleCloseNewFloor = () => setOpen(false);

  const [editFloor, setIsEditFloor] = useState(false);
  const handleOpenEditFloor = () => setIsEditFloor(true);
  const handleCloseEditFloor = () => setIsEditFloor(false);

  return (
    <Box>
      <ListFloorForm />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div>
          <Button onClick={handleOpenNewFloor}>+ Add New</Button>
          <Dialog open={open} onClose={handleCloseNewFloor}>
            <DialogTitle>Create Floor</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="name"
                label="Floor Name"
                fullWidth
                variant="standard"
                sx={{ marginBottom: 2 }}
              />
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleCloseNewFloor}
                >
                  OK
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleCloseNewFloor}
                >
                  Cancel
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog open={editFloor} onClose={handleCloseEditFloor}>
            <DialogTitle>Update Floor</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="name"
                label="Floor Name"
                fullWidth
                variant="standard"
              />
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleCloseEditFloor}
                >
                  OK
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleCloseEditFloor}
                >
                  Cancel
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="justify">Floor Name</TableCell>
                  <TableCell align="justify">Devices</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {floors.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      {row.floorName}{" "}
                      <Tooltip title="Edit">
                        <IconButton>
                          <EditIcon onClick={handleOpenEditFloor} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
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
                          <Button variant="outlined" sx={{ marginRight: 1 }}>
                            {device}
                          </Button>
                        </TableRow>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default ListFloorPage;
