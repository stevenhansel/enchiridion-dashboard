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
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import ViewAnnouncementImageModal from "../components/ViewAnnouncementImageModal";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import { useLazyGetAnnouncementsQuery } from "../services/announcement";
import { AnnouncementStatus } from "../types/constants";
import { Author } from "../types/store";

const toDate = (dateStr: string) => dayjs(dateStr).format("DD MM YYYY");

const FETCH_LIMIT = 20;
const key = "id";

const ListAnnouncementPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AnnouncementStatus | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userText, setUserText] = useState<Author | null>(null);
  const [currentAnnouncementId, setCurrentAnnouncementId] =
    useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const getAnnouncementsQueryParams = {
    page,
    query,
    status,
    userId,
    limit: FETCH_LIMIT,
  };
  const [getAnnouncements, { data, error, isLoading }] =
    useLazyGetAnnouncementsQuery();

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  };

  const handleNavigateToDetailPage = (announcementId: number) => {
    navigate(`/announcement/detail/${announcementId}`);
  };

  const handleSearch = useCallback(() => {
    getAnnouncements(getAnnouncementsQueryParams);
  }, [page, query, status, userId]);

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

  const announcementOptions = Array.from(
    new Set(data?.contents.map((option) => option.author))
  );

  const announcementUniqueByKey = Array.from(
    new Map(
      announcementOptions.map((announcement) => [
        announcement[key],
        announcement,
      ])
    ).values()
  );

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
    getAnnouncements(getAnnouncementsQueryParams);
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
            <Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
                width="100%"
              >
                <Button
                  size="large"
                  sx={{ marginBottom: 3 }}
                  variant="contained"
                  onClick={() => navigate("/announcement/create")}
                >
                  + Create
                </Button>
              </Box>
              <Box display="flex">
                <Box>
                  <TextField
                    id="search"
                    label="Search by title"
                    variant="outlined"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ width: 220 }}
                  />
                </Box>

                <Box sx={{ marginLeft: 1 }}>
                  <Autocomplete
                    id="author"
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    options={announcementUniqueByKey}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                    onChange={(_: any, newValue: Author | null) => {
                      if (newValue?.id && newValue?.name) {
                        setUserId(newValue.id);
                        setUserText(newValue);
                      } else {
                        setUserId(null);
                        setUserText(null);
                      }
                    }}
                    value={userText}
                    renderInput={(params) => (
                      <TextField {...params} label="Author" />
                    )}
                    sx={{ width: 150 }}
                  />
                </Box>

                <Box sx={{ marginLeft: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="announcement-status-select">
                      Status
                    </InputLabel>
                    <Select
                      id="announcement-status-select"
                      sx={{ width: 220 }}
                      value={status !== null ? status : ""}
                      label="Status"
                      onChange={(e: SelectChangeEvent) => {
                        if (e.target.value === "") {
                          setStatus(null);
                        } else {
                          setStatus(
                            e.target.value as AnnouncementStatus | null
                          );
                        }
                      }}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value={AnnouncementStatus.WaitingForApproval}>
                        Waiting for Approval
                      </MenuItem>
                      <MenuItem value={AnnouncementStatus.Active}>
                        Active
                      </MenuItem>
                      <MenuItem value={AnnouncementStatus.Done}>Done</MenuItem>
                      <MenuItem value={AnnouncementStatus.Rejected}>
                        Rejected
                      </MenuItem>
                      <MenuItem value={AnnouncementStatus.Canceled}>
                        Canceled
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex">
                  <Button
                    size="large"
                    sx={{ marginBottom: 3 }}
                    variant="contained"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Box>
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
    </Box>
  );
};

export default ListAnnouncementPage;
