import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

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

import { AnnouncementStatus } from "../types/constants";
import { UserFilterOption } from "../types/store";

import { ApiErrorResponse } from "../services/error";
import { useLazyGetUsersQuery } from "../services/user";
import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import Layout from "../components/Layout";

import usePermission from "../hooks/usePermission";

const toDate = (dateStr: string) => dayjs(dateStr).format("ddd, MMM D, YYYY");

const FETCH_LIMIT = 20;

const ListAnnouncementPage = () => {
  const hasViewAnnouncementDetail = usePermission("view_list_announcement");
  const hasViewAnnouncementMedia = usePermission("view_permission_media");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AnnouncementStatus | null>(null);
  const [userFilter, setUserFilter] = useState<UserFilterOption | null>(null);

  const [isUserFilterLoading, setIsUserFilterLoading] = useState(false);
  const [userFilterOptions, setUserFilterOptions] = useState<
    UserFilterOption[]
  >([]);

  const [currentAnnouncementId, setCurrentAnnouncementId] =
    useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const getAnnouncementsQueryParams = useMemo(
    () => ({
      page,
      query,
      status,
      userId: userFilter !== null ? userFilter.id : null,
      limit: FETCH_LIMIT,
    }),
    [page, query, status, userFilter]
  );

  const [
    getAnnouncements,
    {
      data: announcements,
      error: isAnnouncementsError,
      isLoading: isAnnouncementsLoading,
    },
  ] = useLazyGetAnnouncementsQuery();

  const [
    getUsers,
    { data, isLoading: isGetUsersLoading, error: isUsersError },
  ] = useLazyGetUsersQuery();

  const isLoading = isAnnouncementsLoading && isGetUsersLoading;

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  };

  const handleNavigateToDetailPage = (announcementId: number) => {
    navigate(`/announcement/detail/${announcementId}`);
  };

  const handleSearch = useCallback(() => {
    getAnnouncements(getAnnouncementsQueryParams);
  }, [getAnnouncements, getAnnouncementsQueryParams]);

  const hasPermissionCreateAnnouncement = usePermission("create_announcement");
  const hasPermissionViewUserList = usePermission("view_list_user");

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    []
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    []
  );

  const getUsersDelayed = useMemo(() => {
    return debounce((query: string) => {
      getUsers({ query, limit: 5 }).then(({ data }) => {
        setUserFilterOptions(
          data !== undefined
            ? data.contents.map((u) => ({ id: u.id, name: u.name }))
            : []
        );
        setIsUserFilterLoading(false);
      });
    }, 250);
  }, [getUsers]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!announcements) return true;

    return page === announcements.totalPages;
  }, [page, announcements]);

  useEffect(() => {
    if (isAnnouncementsError && "data" in isAnnouncementsError) {
      setErrorMessage(
        (isAnnouncementsError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isUsersError && "data" in isUsersError) {
      setErrorMessage((isUsersError.data as ApiErrorResponse).messages[0]);
    }
  }, [isAnnouncementsError, isUsersError]);

  useEffect(() => {
    getAnnouncements(getAnnouncementsQueryParams);
  }, [getAnnouncements, page]);

  useEffect(() => {
    if (hasPermissionViewUserList && open) {
      getUsers({ limit: 5 }).then(({ data }) => {
        setUserFilterOptions(
          data !== undefined
            ? data.contents.map((u) => ({ id: u.id, name: u.name }))
            : []
        );
      });
    }
  }, [getUsers, open]);

  return (
    <Layout>
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
                {hasPermissionCreateAnnouncement ? (
                  <Button
                    size="large"
                    sx={{ marginBottom: 3 }}
                    variant="contained"
                    onClick={() => navigate("/announcement/create")}
                  >
                    + Create
                  </Button>
                ) : null}
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
                {hasPermissionViewUserList ? (
                  <Box sx={{ marginLeft: 1 }}>
                    <Autocomplete
                      loading={isUserFilterLoading}
                      options={userFilterOptions}
                      open={open}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onClose={() => {
                        setOpen(false);
                      }}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      sx={{ width: 220 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Author"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {isUserFilterLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      value={userFilter}
                      onChange={(_, inputValue) => {
                        setUserFilterOptions([]);
                        setUserFilter(inputValue);
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason === "input") {
                          setIsUserFilterLoading(true);
                          setUserFilterOptions([]);
                          getUsersDelayed(newInputValue);
                        }
                      }}
                    />
                  </Box>
                ) : null}

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
                      <MenuItem value={AnnouncementStatus.WaitingForSync}>
                        Waiting for Sync
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
            {announcements && announcements.contents.length > 0 ? (
              <>
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
                        <TableCell align="center">
                          {!hasViewAnnouncementMedia ? (
                            <Typography fontSize="14px" fontWeight="bold">
                              Media
                            </Typography>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {announcements?.contents.map((announcement) => (
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
                            {hasViewAnnouncementDetail ? (
                              <Button
                                onClick={() =>
                                  handleNavigateToDetailPage(announcement.id)
                                }
                              >
                                {announcement.title}
                              </Button>
                            ) : (
                              <Button color="inherit">
                                {announcement.title}
                              </Button>
                            )}
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
                            {!hasViewAnnouncementMedia ? (
                              <Button
                                onClick={() =>
                                  handleNavigateToDetailPage(announcement.id)
                                }
                              >
                                Open
                              </Button>
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
        onClose={() => setErrorMessage("")}
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
    </Layout>
  );
};

export default ListAnnouncementPage;
