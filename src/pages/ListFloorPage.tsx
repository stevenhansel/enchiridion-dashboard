import React, { useState, useEffect } from "react";

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
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Autocomplete,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import UpdateFloorModal from "../components/UpdateFloorModal";
import CreateFloorModal from "../components/CreateFloorModal";

import { useGetBuildingsQuery } from "../services/building";
import { useGetFloorsQuery, useDeleteFloorMutation } from "../services/floor";

const ListFloorPage = () => {
  const {
    data: buildingHash,
    isLoading: isGetBuildingsLoading,
    error: getBuildingsError,
  } = useGetBuildingsQuery(null);
  const {
    data: floorHash,
    isLoading: isGetFloorsLoading,
    error: getFloorsError,
  } = useGetFloorsQuery(null);
  const [deleteFloor] = useDeleteFloorMutation();

  const [filterById, setFilterById] = useState("");
  const [filterByBuilding, setFilterByBuilding] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [openCreateFloor, setOpenCreateFloor] = useState(false);
  const [openEditFloor, setOpenEditFloor] = useState(false);

  const isLoading = isGetBuildingsLoading && isGetFloorsLoading;

  const filteredFloors = floorHash
    ? Object.values(floorHash).filter(
        (floor) =>
          (floor.name.toLowerCase().startsWith(filterById.toLowerCase()) ||
            floor.id.toString().startsWith(filterById)) &&
          (filterByBuilding === floor.building.name.toString() ||
            filterByBuilding === null)
      )
    : [];

  const handleDeleteAnnouncement = (floorId: string) => {
    deleteFloor({ floorId });
  };

  const autocompleteBuilding = buildingHash ? Object.values(buildingHash).map((building) => (
    building.name
  )) : [];

  console.log(autocompleteBuilding);

  useEffect(() => {
    if (getBuildingsError) {
      setErrorMessage("Buildings Not Found");
    } else if (getFloorsError) {
      setErrorMessage("Floors Not Found");
    }
  }, [getBuildingsError, getFloorsError]);

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Box>
      <UpdateFloorModal
        buildingHash={buildingHash}
        open={openEditFloor}
        setOpen={setOpenEditFloor}
      />
      <CreateFloorModal
        buildingHash={buildingHash}
        open={openCreateFloor}
        setOpen={setOpenCreateFloor}
      />
      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box display="flex">
            <Box>
              <TextField
                id="search"
                label="Search by floorname or ID"
                variant="outlined"
                onChange={(e) => {
                  setFilterById(e.target.value);
                }}
                sx={{ width: 220 }}
              />
            </Box>
            <Box>
              <Stack>
                <Autocomplete
                  options={autocompleteBuilding}
                  renderInput={(params) => (
                    <TextField {...params} label="Building" />
                  )}
                  value={filterByBuilding}
                  onChange={(_: any, newValue: string | null) => setFilterByBuilding(newValue)}
                  sx={{ width: 150 }}
                />
              </Stack>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              width="100%"
            >
              <Button
                variant="contained"
                onClick={() => setOpenCreateFloor(true)}
              >
                + Create
              </Button>
            </Box>
          </Box>
          {filteredFloors && filteredFloors.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Floor Name</TableCell>
                    <TableCell align="center">Building</TableCell>
                    <TableCell align="center">Devices</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFloors.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        <Button variant="outlined" sx={{ marginRight: 1 }}>
                          {row.building.name}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {row.devices.map((device) => (
                          <Button
                            key={device.id}
                            variant="outlined"
                            sx={{ marginRight: 1 }}
                          >
                            {device.name}
                          </Button>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              handleDeleteAnnouncement(row.id.toString())
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => setOpenEditFloor(true)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Not Found!</Typography>
          )}
        </Box>
      )}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
        action={action}
      />
    </Box>
  );
};

export default ListFloorPage;
