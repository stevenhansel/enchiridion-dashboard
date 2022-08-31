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
import CreateBuildingModal from "../components/CreateBuildingModal";

import {
  useGetBuildingsQuery,
  useCreateBuildingMutation,
} from "../services/building";

import {
  useLazyGetFloorsQuery,
  useDeleteFloorMutation,
} from "../services/floor";

import { Building } from "../types/store";
import Layout from "../components/Layout";
import { ApiErrorResponse } from "../services/error";

const FETCH_LIMIT = 20;
const key = "id";

const ListFloorPage = () => {
  const [deleteFloor] = useDeleteFloorMutation();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("");

  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [buildingText, setBuildingText] = useState<Building | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [openCreateFloor, setOpenCreateFloor] = useState(false);
  const [openCreateBuilding, setOpenCreateBuilding] = useState(false);
  const [openEditFloor, setOpenEditFloor] = useState(false);

  const getFloorsQueryParams = { page, query, limit: FETCH_LIMIT, buildingId };
  const [
    getFloors,
    { data: floors, error: floorsError, isLoading: isFloorsLoading },
  ] = useLazyGetFloorsQuery();

  const {
    data: buildings,
    error: buildingsError,
    isLoading: isBuildingsLoading,
  } = useGetBuildingsQuery(null);

  const isLoading = isFloorsLoading && isBuildingsLoading;

  const handleDeleteAnnouncement = (floorId: string) => {
    deleteFloor({ floorId });
  };

  const handleSearch = useCallback(() => {
    getFloors(getFloorsQueryParams);
  }, [page, query, author, buildingId]);

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
    if (!floors) return true;
    return page === floors.totalPages;
  }, [page, floors]);

const buildingOptions = Array.from(
    new Set(buildings?.map((option) => option))
  );

  const buildingUniqueByKey = Array.from(
    new Map(
      buildingOptions.map((building) => [
        building[key],
        building,
      ])
    ).values()
  );

  useEffect(() => {
    if (buildingsError && 'data' in buildingsError) {
      setErrorMessage((buildingsError.data as ApiErrorResponse).messages[0]);
    } else if (floorsError && 'data' in floorsError) {
      setErrorMessage((floorsError.data as ApiErrorResponse).messages[0]);
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
    <Layout>
      <UpdateFloorModal
        buildingHash={buildings}
        open={openEditFloor}
        setOpen={setOpenEditFloor}
      />
      <CreateFloorModal
        buildings={buildings}
        open={openCreateFloor}
        setOpen={setOpenCreateFloor}
      />
      <CreateBuildingModal
        open={openCreateBuilding}
        setOpen={setOpenCreateBuilding}
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
              + Create Floor
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenCreateBuilding(true)}
              size="large"
              sx={{ marginBottom: 3, marginLeft: 1 }}
            >
              + Create Building 
            </Button>
          </Box>
          <Box display="flex">
            <Box>
              <TextField
                id="search"
                label="Search by floorname"
                variant="outlined"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: 220, marginRight: 1 }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Autocomplete
                options={buildingUniqueByKey}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                onChange={(_: any, newValue: Building | null) => {
                  if (newValue?.id && newValue?.name) {
                    setBuildingId(newValue?.id);
                    setBuildingText(newValue);
                  } else {
                    setBuildingId(null);
                    setBuildingText(null);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Building" />
                )}
                value={buildingText}
                sx={{ width: 150 }}
              />
              <Button onClick={handleSearch} variant="contained">
                Search
              </Button>
            </Box>
          </Box>
          {floors && floors.contents.length > 0 ? (
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
                  {floors.contents.map((row) => (
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
                          <Tooltip key={device.id} title={device.description}>
                            <Button variant="outlined" sx={{ marginRight: 1 }}>
                              {device.name}
                            </Button>
                          </Tooltip>
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
        <Box display="flex" alignItems="center">
          {page}
        </Box>
        <IconButton
          disabled={isNextButtonDisabled}
          onClick={handlePaginationNextPage}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Layout>
  );
};

export default ListFloorPage;
