import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSelector } from "react-redux";

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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import UpdateFloorModal from "../components/UpdateFloorModal";
import CreateFloorModal from "../components/CreateFloorModal";
import BuildingModal from "../components/BuildingModal";

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

import { RootState } from "../store";

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
  const [floorId, setFloorId] = useState("");

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

  const profile = useSelector((state: RootState) => state.profile);

  const handleDeleteAnnouncement = useCallback((floorId: string) => {
    deleteFloor({ floorId });
  }, []);

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

  const handleSelectFloor = useCallback((floorId: string) => {
    setOpenEditFloor(true);
    setFloorId(floorId);
  }, [floorId, openEditFloor]);

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
      buildingOptions.map((building) => [building[key], building])
    ).values()
  );

  const hasPermissionCreateFloor = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("create_floor")) {
      return true;
    }
    return false;
  }, [profile]);

  const hasPermissionUpdateFloor = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("update_floor")) {
      return true;
    }
    return false;
  }, [profile]);

  const hasPermissionDeleteFloor = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (permissions.includes("delete_floor")) {
      return true;
    }
    return false;
  }, [profile]);

  const hasPermissionBuilding = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((p) => p.value);

    if (
      permissions.includes("create_building") ||
      permissions.includes("update_building") ||
      permissions.includes("update_building")
    ) {
      return true;
    }
    return false;
  }, [profile]);

  useEffect(() => {
    if (buildingsError && "data" in buildingsError) {
      setErrorMessage((buildingsError.data as ApiErrorResponse).messages[0]);
    } else if (floorsError && "data" in floorsError) {
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
      <BuildingModal
        open={openCreateBuilding}
        setOpen={setOpenCreateBuilding}
      />
      <Dialog open={openEditFloor} onClose={() => setOpenEditFloor(false)}>
        <DialogTitle>Update Floor</DialogTitle>
        <DialogContent>
          <UpdateFloorModal setOpen={setOpenEditFloor} floorId={floorId}/>
          <Button
            variant="contained"
            component="label"
            onClick={() => setOpenEditFloor(false)}
          >
           Close 
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={openCreateFloor} onClose={() => setOpenCreateFloor(false)}>
        <DialogTitle>Create Floor</DialogTitle>
        <DialogContent>
          <CreateFloorModal setOpen={setOpenCreateFloor}/>
          <Button
            variant="contained"
            component="label"
            onClick={() => setOpenCreateFloor(false)}
          >
           Close 
          </Button>
        </DialogContent>
      </Dialog>
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
            {hasPermissionCreateFloor ? (
              <Button
                variant="contained"
                onClick={() => setOpenCreateFloor(true)}
                size="large"
                sx={{ marginBottom: 3 }}
              >
                + Create Floor
              </Button>
            ) : null}
            {hasPermissionBuilding ? (
              <Button
                variant="contained"
                onClick={() => setOpenCreateBuilding(true)}
                size="large"
                sx={{ marginBottom: 3, marginLeft: 1 }}
              >
                Building Menu
              </Button>
            ) : null}
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
            </Box>
            <Box>
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
                        <Button
                          variant="contained"
                          color="inherit"
                          sx={{
                            marginRight: 1,
                            backgroundColor: row.building.color,
                          }}
                        >
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
                        {hasPermissionDeleteFloor ? (
                          <>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() =>
                                  handleDeleteAnnouncement(row.id.toString())
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : null}
                        {hasPermissionUpdateFloor ? (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() =>
                                  handleSelectFloor(row.id.toString())
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : null}
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
