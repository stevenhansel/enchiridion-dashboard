import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { CircularProgress } from "@mui/material";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { useLazyGetDevicesQuery } from "../services/device";
import Layout from "../components/Layout";
import { ApiErrorResponse } from "../services/error";
import CreateDeviceModal from "../components/CreateDeviceModal";

const FETCH_LIMIT = 20;

const DevicePage = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const getDeviceQueryParams = { page, query, limit: FETCH_LIMIT };
  const [getDevices, { data, isLoading, error }] = useLazyGetDevicesQuery();

  const handleNavigateToDetailPage = (deviceId: number) => {
    navigate(`/device/detail/${deviceId}`);
  };

  const handleSearch = useCallback(
    () => getDevices(getDeviceQueryParams),
    [page, query]
  );

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    []
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    []
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!data) return true;

    return page === data.totalPages;
  }, [page]);

  useEffect(() => {
    getDevices(getDeviceQueryParams);
  }, [page]);

  useEffect(() => {
    if (error && "data" in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <Layout>
      {!isLoading ? (
        <>
          <Box display="flex" flexDirection="column" width="100%">
            <Box sx={{ marginBottom: 1 }}>
              <TextField
                id="search"
                label="Search by device name or ID"
                variant="outlined"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ width: 250 }}
              />
              <Button onClick={handleSearch} size="large" variant="contained">
                Search
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setOpen(true);
                }}
              >
                + Create Device
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
                        <TableCell align="center">Location</TableCell>
                        <TableCell align="center">
                          Active Announcements
                        </TableCell>
                        <TableCell align="center">Descriptions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data &&
                        data.contents.map((device) => (
                          <TableRow
                            key={device.id}
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
                            <TableCell align="center">
                              {device.location}
                            </TableCell>
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
                <CreateDeviceModal setOpen={setOpen}/>
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
    </Layout>
  );
};

export default DevicePage;
