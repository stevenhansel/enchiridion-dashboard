import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Link,
  IconButton,
  Snackbar,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import { useLazyGetDevicesQuery } from '../services/device';
import { ApiErrorResponse } from '../services/error';
import CreateDeviceModal from '../components/CreateDeviceModal';
import config from '../config';
import DeviceStatus, { DeviceState } from '../components/DeviceStatus';
import { usePermission } from '../hooks';

const FETCH_LIMIT = 20;

const DeviceRow = (props: {
  device: {
    id: number;
    name: string;
    location: string;
    activeAnnouncements: number;
    description: string;
  };
  handleNavigateToDetailPage: (deviceId: number) => void;
  deviceDetailPermission: boolean;
}) => {
  const { device, handleNavigateToDetailPage, deviceDetailPermission } = props;

  const { lastMessage } = useWebSocket(
    `${config.wssBaseUrl}/v1/device_status/${device.id}`
  );

  const deviceState = useMemo(() => {
    return lastMessage !== null
      ? (lastMessage.data as DeviceState)
      : DeviceState.Loading;
  }, [lastMessage]);

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell align="center">
        {deviceDetailPermission ? (
          <Link onClick={() => handleNavigateToDetailPage(device.id)}>
            {device.id}
          </Link>
        ) : (
          <Typography>{device.id}</Typography>
        )}
      </TableCell>
      <TableCell align="center">{device.name}</TableCell>
      <TableCell
        align="center"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <DeviceStatus state={deviceState} fontSize={14} />
      </TableCell>
      <TableCell align="center">{device.location}</TableCell>
      <TableCell align="center">{device.activeAnnouncements}</TableCell>
      <TableCell align="center">{device.description}</TableCell>
    </TableRow>
  );
};

const DevicePage = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasViewDeviceDetailPermission = usePermission('view_device_detail');
  const hasCreateDevicePermission = usePermission('create_device');

  const getDeviceQueryParams = { page, query, limit: FETCH_LIMIT };
  const [getDevices, { data, isLoading, error }] = useLazyGetDevicesQuery();

  const deviceQueryParams = searchParams.get('deviceQueryParams');

  const handleNavigateToDetailPage = (deviceId: number) => {
    navigate(`/device/detail/${deviceId}`);
  };

  const handleSearch = useCallback(() => {
    if (query !== '') {
      setSearchParams({
        deviceQueryParams: query,
      });
    } else {
      setSearchParams({});
    }
    getDevices(getDeviceQueryParams);
  }, [page, query]);

  const handlePaginationPreviousPage = useCallback(
    () => setPage(page => page - 1),
    []
  );

  const handlePaginationNextPage = useCallback(
    () => setPage(page => page + 1),
    []
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!data) return true;

    return page === data.totalPages && data?.hasNext === false;
  }, [data]);

  useEffect(() => {
    getDevices(getDeviceQueryParams);
  }, [page]);

  useEffect(() => {
    if (error && 'data' in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  useEffect(() => {
    getDevices({ query: deviceQueryParams });
  }, [deviceQueryParams]);

  return (
    <>
      {!isLoading ? (
        <>
          <Box sx={{ marginBottom: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Device Page
            </Typography>
          </Box>
          {hasCreateDevicePermission ? (
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setOpen(true);
                }}
                sx={{ marginBottom: 3 }}
              >
                + Create Device
              </Button>
            </Box>
          ) : null}
          <Box display="flex" flexDirection="column" width="100%">
            <Box sx={{ marginBottom: 1 }}>
              <TextField
                id="search"
                label="Search by device name"
                variant="outlined"
                autoComplete="off"
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ width: 250 }}
              />
              <Button
                onClick={handleSearch}
                size="large"
                variant="contained"
                sx={{ marginLeft: 1 }}
              >
                Search
              </Button>
            </Box>
            {data && data.contents.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">State</TableCell>
                        <TableCell align="center">Location</TableCell>
                        <TableCell align="center">
                          Active Announcements
                        </TableCell>
                        <TableCell align="center">
                          Description Location
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data &&
                        data.contents.map(device => (
                          <DeviceRow
                            key={device.id}
                            device={device}
                            handleNavigateToDetailPage={
                              handleNavigateToDetailPage
                            }
                            deviceDetailPermission={
                              hasViewDeviceDetailPermission
                            }
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box display="flex" justifyContent="center">
                  <IconButton
                    disabled={isPreviousButtonDisabled}
                    onClick={handlePaginationPreviousPage}
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
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogTitle>Create Device</DialogTitle>
              <DialogContent>
                <CreateDeviceModal setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
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

export default DevicePage;
