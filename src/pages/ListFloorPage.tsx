import React, { useCallback, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Select
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ListFloorForm from "../components/ListFloorForm";
import axios from "../utils/axiosInstance";

type Building = {
  id: number;
  floorName: string;
  buildingName: string;
  devices: string[];
};

type Campuses = {
  value: string;
  campusName: string;
};

type Props = {
  children?: React.ReactNode;
};

const floorMock: Building[] = [
  {
    id: 1,
    floorName: "Lantai SK",
    buildingName: "Syahdan",
    devices: ["Device 1", "Device 2", "Device 3", "Device 4"],
  },
  {
    id: 2,
    floorName: "Lantai CS",
    buildingName: "Anggrek",
    devices: ["Device 1", "Device 2", "Device 3", "Device 4", "Device 5"],
  },
  {
    id: 3,
    floorName: "Lantai SI",
    buildingName: "Syahdan",
    devices: ["Device 1", "Device 2", "Device 3"],
  },
];

const campusesMock: Campuses[] = [
  {
    value: "syahdan",
    campusName: "Syahdan",
  },
  {
    value: "alam sutera",
    campusName: "Alam Sutera",
  },
  {
    value: "anggrek",
    campusName: "Anggrek",
  },
  {
    value: "bandung",
    campusName: "Bandung",
  },
  {
    value: "malang",
    campusName: "Malang",
  },
  {
    value: "medan",
    campusName: "Medan",
  },
  {
    value: "all campuses",
    campusName: "All Campuses",
  },
];

const ListFloorPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [floors, setFloor] = useState<Building[]>(floorMock);

  const [open, setOpen] = useState(false);
  const handleOpenNewFloor = () => setOpen(true);
  const handleCloseNewFloor = () => setOpen(false);

  const [editFloor, setIsEditFloor] = useState(false);
  const handleOpenEditFloor = () => setIsEditFloor(true);
  const handleCloseEditFloor = () => setIsEditFloor(false);

  const [foundUsers, setFoundUsers] = useState(floors);

  const [selectedCampus, setIsSelectedCampus] = useState("");


  const handleListFloor = useCallback(async(): Promise<void> => {
    try {
      await axios.get('/v1/floors')
    } catch {

    }
  }, []);



  const filterUsers = (e: any) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const result = floors.filter((floor) => {
        return (
          floor.floorName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          floor.id.toString().startsWith(keyword.toLowerCase())
        );
      });
      setFoundUsers(result);
    } else {
      setFoundUsers(floors);
    }
  };

  const filterBuilding = (selectByUser: any): any => {
    const filtered = floors.filter(
      (floor) => floor.buildingName === selectByUser
    );
    return filtered;
  };

  const handleFilterBuilding = (e: any) => {
    const selected = e.target.value;

    if (selected !== "All Campuses") {
      setFoundUsers(filterBuilding(selected));
    } else {
      setFoundUsers(floors);
    }
    setIsSelectedCampus(selected);
  };

  return (
    <Box>
      <ListFloorForm />
      <div>
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
        <Box>
          <Box display="flex">
            <Box>
              <TextField
                id="search"
                label="Search by floorname or ID"
                variant="outlined"
                onChange={filterUsers}
                sx={{ width: 220 }}
              />
            </Box>
            <Box sx={{ marginLeft: 1 }}>
              <FormControl sx={{ width: 220 }}>
                <InputLabel id="demo-simple-select-label">Building</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Building"
                  onChange={handleFilterBuilding}
                  value={selectedCampus}
                >
                  {campusesMock.map((campus) => (
                    <MenuItem key={campus.value} value={campus.campusName}>
                      {campus.campusName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              width="100%"
            >
              <Button variant="contained" onClick={handleOpenNewFloor}>
                + Create
              </Button>
            </Box>
          </Box>
          {foundUsers.length > 0 && foundUsers ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="justify">Floor Name</TableCell>
                    <TableCell align="justify">Building</TableCell>
                    <TableCell align="justify">Devices</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foundUsers.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="justify">{row.floorName}</TableCell>
                      <TableCell align="justify">
                        <Button variant="contained">{row.buildingName}</Button>
                      </TableCell>
                      <TableCell
                        align="justify"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        {row.devices.map((device, index) => (
                          <TableRow
                            key={index}
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
                        <Tooltip title="Edit">
                          <IconButton>
                            <EditIcon onClick={handleOpenEditFloor} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ marginTop: 2 }}>Not found!</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ListFloorPage;
