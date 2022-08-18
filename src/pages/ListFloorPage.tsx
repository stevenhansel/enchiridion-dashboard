import React, { useState, useEffect, useCallback, useMemo } from "react";

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
  Autocomplete,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import UpdateFloorModal from "../components/UpdateFloorModal";
import CreateFloorModal from "../components/CreateFloorModal";

import {
  useGetBuildingsQuery,
  useCreateBuildingMutation,
} from "../services/building";

import {
  useLazyGetFloorsQuery,
  useDeleteFloorMutation,
  useCreateFloorMutation,
  useGetFloorsQuery,
} from "../services/floor";

const FETCH_LIMIT = 20;

const ListFloorPage = () => {
  const [deleteFloor] = useDeleteFloorMutation();
  const [createBuilding] = useCreateBuildingMutation();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState('');

  const [errorMessage, setErrorMessage] = useState("");

  const [openCreateFloor, setOpenCreateFloor] = useState(false);
  const [openEditFloor, setOpenEditFloor] = useState(false);

  const getFloorsQueryParams = { page, query, limit: FETCH_LIMIT, author };
  const [
    getFloors,
    { data: floorsData, error: floorsError, isLoading: isFloorsLoading },
  ] = useLazyGetFloorsQuery();

  const {
    data: buildingsData,
    error: buildingsError,
    isLoading: isBuildingsLoading,
  } = useGetBuildingsQuery(null);

  const isLoading = isFloorsLoading && isBuildingsLoading;

  console.log(floorsData);

  const handleDeleteAnnouncement = (floorId: string) => {
    deleteFloor({ floorId });
  };

  const handleSearch = useCallback(
    () => getFloors(getFloorsQueryParams),
    [page, query, author]
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    []
  );

  const handlePaginationPrevPage = useCallback(
    () => setPage((page) => page - 1),
    []
  );

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);

  const isNextButtonDisabled = useMemo(() => {
    if (!floorsData) return true;
    return page === floorsData.totalPages;
  }, [page, floorsData]);

  useEffect(() => {
    if (buildingsError) {
      setErrorMessage("Buildings Not Found");
    } else if (floorsError) {
      setErrorMessage("Floors Not Found");
    }
  }, [buildingsError, floorsError]);

  useEffect(() => {
    getFloors(getFloorsQueryParams);
  }, [page]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
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
        buildingHash={buildingsData}
        open={openEditFloor}
        setOpen={setOpenEditFloor}
      />
      <CreateFloorModal
        buildingHash={buildingsData}
        open={openCreateFloor}
        setOpen={setOpenCreateFloor}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            width="100%"
          >
            <Button
              variant="contained"
              onClick={() => setOpenCreateFloor(true)}
              size="large"
              sx={{ marginBottom: 3 }}
            >
              + Create
            </Button>
          </Box>
          <Box display="flex">
            <Box >
              <TextField
                id="search"
                label="Search by floorname"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: 220, marginRight: 1 }}
              />
              <Button onClick={handleSearch} variant="contained">Search</Button>
            </Box>
            {/* <Box>
              <Autocomplete
                options={buildingOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Building" />
                )}
                value={filterByBuilding}
                onChange={(_: any, newValue: string | null) =>
                  setFilterByBuilding(newValue)
                }
                sx={{ width: 150 }}
              />
            </Box> */}
            <Box display="flex" justifyContent="flex-end"></Box>
          </Box>
          {floorsData && floorsData.contents.length > 0 ? (
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
                  {floorsData.contents.map((row) => (
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
      <Box
        sx={{ marginTop: 1 }}
        display="flex"
        justifyContent="center"
        flexDirection="row"
      >
        <IconButton
          disabled={isPreviousButtonDisabled}
          onClick={handlePaginationPrevPage}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton
          disabled={isNextButtonDisabled}
          onClick={handlePaginationNextPage}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ListFloorPage;
