import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { useSearchParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import UpdateFloorModal from '../components/UpdateFloorModal';
import CreateFloorModal from '../components/CreateFloorModal';
import BuildingModal from '../components/BuildingModal';
import { useLazyGetBuildingsQuery } from '../services/building';
import { useLazyGetFloorsQuery } from '../services/floor';
import { ApiErrorResponse } from '../services/error';
import { UserFilterOption } from '../types/store';
import { usePermission } from '../hooks';
import DeleteFloorModal from '../components/DeleteFloorModal';

const FETCH_LIMIT = 20;

const ListFloorPage = () => {
  const hasPermissionCreateFloor = usePermission('create_floor');
  const hasPermissionUpdateFloor = usePermission('update_floor');
  const hasPermissionDeleteFloor = usePermission('delete_floor');

  const hasPermissionMutateBuilding = usePermission(
    'create_building',
    'update_building',
    'delete_building'
  );
  const hasViewBuildingPermission = usePermission('view_list_building');

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);

  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );

  const [errorMessage, setErrorMessage] = useState('');

  const [openCreateFloor, setOpenCreateFloor] = useState(false);
  const [openCreateBuilding, setOpenCreateBuilding] = useState(false);
  const [openEditFloor, setOpenEditFloor] = useState(false);
  const [floorId, setFloorId] = useState('');
  const [floorName, setFloorName] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [open, setOpen] = useState(false);
  const [openDeleteFloorModal, setOpenDeleteFloorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const floorQueryParams = searchParams.get('floorQueryParams');
  const buildingQueryParams = searchParams.get('buildingQueryParams');

  const getFloorsQueryParams = {
    page,
    buildingId: buildingFilter !== null ? buildingFilter.id : null,
    limit: FETCH_LIMIT,
    query,
  };

  const [
    getFloors,
    { data: floors, error: floorsError, isLoading: isFloorsLoading },
  ] = useLazyGetFloorsQuery();

  const [
    getBuildings,
    { error: buildingsError, isLoading: isBuildingsLoading },
  ] = useLazyGetBuildingsQuery();

  const isLoading = isFloorsLoading && isBuildingsLoading;

  const handleSearch = useCallback(
    (query: string) => {
      if (query === '' && buildingFilter === null) {
        setSearchParams({});
      } else if (query !== '' && buildingFilter === null) {
        setSearchParams({
          floorQueryParams: query,
        });
      } else if (query === '' && buildingFilter !== null) {
        setSearchParams({
          buildingQueryParams:
            buildingFilter !== null ? buildingFilter.id.toString() : '',
        });
      } else {
        setSearchParams({
          floorQueryParams: query,
          buildingQueryParams:
            buildingFilter !== null ? buildingFilter.id.toString() : '',
        });
      }
      getFloors(getFloorsQueryParams);
    },
    [getFloors, getFloorsQueryParams, searchParams]
  );

  const handlePaginationNextPage = useCallback(
    () => setPage(page => page + 1),
    []
  );

  const handlePaginationPrevPage = useCallback(
    () => setPage(page => page - 1),
    []
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const getBuildingDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ query, limit: 5 }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map(b => ({
                id: b.id,
                name: b.name,
              }))
            : []
        );
        setIsBuildingFilterLoading(false);
      });
    }, 250);
  }, [getBuildings]);

  const handleSelectFloor = useCallback(
    (floorId: string) => {
      setOpenEditFloor(true);
      setFloorId(floorId);
    },
    [floorId, openEditFloor]
  );

  const handleDeleteFloorModal = useCallback(
    (floorId: string, floorName: string, buildingName: string) => {
      setOpenDeleteFloorModal(true);
      setFloorId(floorId);
      setFloorName(floorName);
      setBuildingName(buildingName);
    },
    [floorId, floorName, buildingName]
  );

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);

  const isNextButtonDisabled = useMemo(() => {
    if (!floors) return true;
    return page === floors.totalPages;
  }, [page, floors]);

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

  useEffect(() => {
    if (hasViewBuildingPermission && open) {
      getBuildings({ limit: 5, query: buildingFilter?.name }).then(
        ({ data }) => {
          setBuildingFilterOptions(
            data !== undefined
              ? data.map(b => ({
                  id: b.id,
                  name: b.name,
                }))
              : []
          );
        }
      );
    }
  }, [hasViewBuildingPermission, getBuildings, open]);

  useEffect(() => {
    getFloors({
      query: floorQueryParams,
      buildingId: Number(buildingQueryParams),
    });
  }, [floorQueryParams, buildingQueryParams]);

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          List Floor Page
        </Typography>
      </Box>
      <BuildingModal
        open={openCreateBuilding}
        setOpen={setOpenCreateBuilding}
        setSuccessMessage={setSuccessMessage}
      />
      <Dialog open={openEditFloor} onClose={() => setOpenEditFloor(false)}>
        <DialogTitle>Update Floor</DialogTitle>
        <DialogContent>
          <UpdateFloorModal setOpen={setOpenEditFloor} floorId={floorId} />
        </DialogContent>
      </Dialog>
      <Dialog open={openCreateFloor} onClose={() => setOpenCreateFloor(false)}>
        <DialogTitle>Create Floor</DialogTitle>
        <DialogContent>
          <CreateFloorModal setOpen={setOpenCreateFloor} />
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
            {hasPermissionMutateBuilding ? (
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
            <Box sx={{ marginBottom: 1 }}>
              <TextField
                id="search"
                label="Search by Floor Name or ID"
                variant="outlined"
                autoComplete="off"
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ width: 230, marginRight: 1 }}
              />
            </Box>
            {hasViewBuildingPermission ? (
              <Box display="flex" justifyContent="flex-end">
                <Autocomplete
                  options={buildingFilterOptions}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  loading={isBuildingFilterLoading}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={option => option.name}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  onChange={(_, inputValue) => {
                    setBuildingFilterOptions([]);
                    setBuildingFilter(inputValue);
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === 'input') {
                      setBuildingFilterOptions([]);
                      setIsBuildingFilterLoading(true);
                      getBuildingDelayed(newInputValue);
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Building"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isBuildingFilterLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  value={buildingFilter}
                  sx={{ width: 150 }}
                />
              </Box>
            ) : null}

            <Box>
              <Button
                onClick={() => handleSearch(query)}
                variant="contained"
                size="large"
                sx={{ marginLeft: 1 }}
              >
                Search
              </Button>
            </Box>
          </Box>
          {floors && floors.contents.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ width: '100%' }}>
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
                    {floors.contents.map(row => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
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
                        <TableCell align="center" sx={{ maxWidth: '700px' }}>
                          {row.devices.map(device => (
                            <Tooltip key={device.id} title={device.description}>
                              <Button
                                variant="outlined"
                                sx={{
                                  marginRight: 1,
                                  width: '120',
                                }}
                              >
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
                                    handleDeleteFloorModal(
                                      row.id.toString(),
                                      row.name,
                                      row.building.name
                                    )
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
            </>
          ) : (
            <Typography>Not Found!</Typography>
          )}
          <Dialog
            open={openDeleteFloorModal}
            onClose={() => setOpenDeleteFloorModal(false)}
          >
            <DialogTitle>Delete Floor</DialogTitle>
            <DialogContent>
              <DeleteFloorModal
                floorName={floorName}
                floorId={floorId}
                buildingName={buildingName}
                setOpen={setOpenDeleteFloorModal}
              />
            </DialogContent>
          </Dialog>
        </Box>
      )}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        action={
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
        }
      />
    </>
  );
};

export default ListFloorPage;
