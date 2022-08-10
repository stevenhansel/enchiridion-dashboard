import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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
  Snackbar,
  IconButton,
  Autocomplete,
  Typography,
} from "@mui/material";
import ViewAnnouncementImageModal from "../components/ViewAnnouncementImageModal";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { useGetAnnouncementsQuery } from "../services/announcement";

type Status = {
  label: string;
  value: string;
};

const statuses: Status[] = [
  {
    label: "Waiting for Status",
    value: "waiting for status",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Canceled",
    value: "canceled",
  },
  {
    label: "Done",
    value: "done",
  },
];

type Author = {
  id: number;
  name: string;
};

const toDate = (dateStr: string) => dayjs(dateStr).format("DD MM YYYY");

const FETCH_LIMIT = 2;

const ListAnnouncementPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetAnnouncementsQuery({ page, limit: FETCH_LIMIT });

  const [currentAnnouncementId, setCurrentAnnouncementId] =
    useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [filterById, setFilterById] = useState("");
  const [filterByAuthor, setFilterByAuthor] = useState<string | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [options, setOptions] = useState<readonly Author[]>([]);
  const [open, setOpen] = useState(false);

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  };

  const handleNavigateToDetailPage = (announcementId: number) => {
    navigate(`/announcement/detail/${announcementId}`);
  };

  const handlePaginationPreviousPage = useCallback(() => setPage((page) => page - 1), []);
  const handlePaginationNextPage = useCallback(() => setPage((page) => page + 1), []);

  // const filteredAnnouncements = announcementHash
  //   ? Object.values(announcementHash).filter(
  //       (announcement) =>
  //         (announcement.title
  //           .toLowerCase()
  //           .startsWith(filterById.toLowerCase()) ||
  //           announcement.id.toString().startsWith(filterById)) &&
  //         (filterByAuthor === announcement.author.name ||
  //           filterByAuthor === null) &&
  //         (filterByStatus === announcement.status.label ||
  //           filterByStatus === null)
  //     )
  //   : [];

  // const announcementOptions = announcementHash
  //   ? Array.from(
  //       new Set(
  //         Object.values(announcementHash).map((announcement) => ({
  //           id: announcement.author.id,
  //           name: announcement.author.name,
  //         }))
  //       )
  //     )
  //   : [];

  const statusOptions = statuses ? statuses.map((status) => status.label) : [];

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

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!data) return true;

    return page === data.totalPages;
  }, [page, data]);

  useEffect(() => {
    if (error) {
      setErrorMessage("Announcements List Not Found");
    }
  }, [error]);

  useEffect(() => {
    let active: boolean = true;

    if (!isLoading) {
      return undefined;
    }
    if (active) {
      // setOptions([...announcementOptions]);
    }
    return () => {
      active = false;
    };
  }, [isLoading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {!isLoading ? (
          <>
            <Box display="flex">
              <Box>
                <TextField
                  id="search"
                  label="Search by title or ID"
                  variant="outlined"
                  onChange={(e) => {
                    setFilterById(e.target.value);
                  }}
                  sx={{ width: 220 }}
                />
              </Box>
              <Box sx={{ marginLeft: 1 }}>
                {/* <Autocomplete
                  id="author"
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  options={announcementOptions}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  getOptionLabel={(option) => option.name}
                  loading={!isLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Asynchronous"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                  sx={{ width: 150 }}
                /> */}
              </Box>
              <Box sx={{ marginLeft: 1 }}>
                <Autocomplete
                  options={statusOptions}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" />
                  )}
                  value={filterByStatus}
                  onChange={(_: any, newValue: string | null) =>
                    setFilterByStatus(newValue)
                  }
                  sx={{ width: 150 }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="100%"
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/announcement/create")}
                >
                  + Create
                </Button>
              </Box>
            </Box>
            {data && data.contents.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="center">Title</TableCell>
                      <TableCell align="center">Start Date</TableCell>
                      <TableCell align="center">End Date</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Author</TableCell>
                      <TableCell align="center">Created At</TableCell>
                      <TableCell align="center">Media</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.contents.map((announcement) => (
                      <TableRow
                        key={announcement.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {announcement.id}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() =>
                              handleNavigateToDetailPage(announcement.id)
                            }
                          >
                            {announcement.title}
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          {toDate(announcement.startDate)}
                        </TableCell>
                        <TableCell align="center">
                          {toDate(announcement.endDate)}
                        </TableCell>
                        <TableCell align="center">
                          {announcement.status.label}
                        </TableCell>
                        <TableCell align="center">
                          {announcement.author.name}
                        </TableCell>
                        <TableCell align="center">
                          {toDate(announcement.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() =>
                              handleSelectAnnouncementImage(announcement.id)
                            }
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Not Found!</Typography>
            )}
          </>
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Box>
      <ViewAnnouncementImageModal
        announcementId={currentAnnouncementId}
        open={imageModalOpen}
        setOpen={setImageModalOpen}
      />
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
        <IconButton disabled={isPreviousButtonDisabled} onClick={handlePaginationPreviousPage}>
          <NavigateBeforeIcon />
        </IconButton>

        <IconButton disabled={isNextButtonDisabled} onClick={handlePaginationNextPage}>
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ListAnnouncementPage;