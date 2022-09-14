import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import {
  useApproveRejectRequestMutation,
  useLazyGetRequestsQuery,
} from "../services/request";

import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import { useLazyGetUsersQuery } from "../services/user";

import { UserFilterOption } from "../types/store";

import { actions } from "../types/constants";
import Layout from "../components/Layout";

import { ApiErrorResponse } from "../services/error";
import { usePermission } from "../hooks";

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const FETCH_LIMIT = 20;

const key = "id";

const RequestsPage = () => {
  const hasUpdateRequestApprovalPermission = usePermission(
    "update_request_approval"
  );
  const [openUserFilter, setOpenUserFilter] = useState(false);
  const [openAnnouncementFilter, setOpenAnnouncementFilter] = useState(false);
  const [actionType, setActionType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [approvedByLsc, setApprovedByLsc] = useState<boolean | null>(null);
  const [approvedByLscText, setApprovedByLscText] = useState("");
  const [approvedByBm, setApprovedByBm] = useState<boolean | null>(null);
  const [approvedByBmText, setApprovedByBmText] = useState("");
  const [userFilter, setUserFilter] = useState<UserFilterOption | null>(null);
  const [userFilterOptions, setUserFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [isUserFilterLoading, setIsUserFilterLoading] = useState(false);

  const [announcementFilter, setAnnouncementFilter] =
    useState<UserFilterOption | null>(null);
  const [announcementFilterOptions, setAnnouncementFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [isAnnouncementFilterLoading, setIsAnnouncementFilterLoading] =
    useState(false);

  const getRequestQueryParams = {
    page,
    query,
    userId: userFilter !== null ? userFilter.id : null,
    announcementId: announcementFilter !== null ? announcementFilter.id : null,
    actionType,
    approvedByLsc,
    approvedByBm,
    limit: FETCH_LIMIT,
  };

  const [
    getRequests,
    {
      data: requests,
      isLoading: isGetRequestLoading,
      error: isGetRequestError,
    },
  ] = useLazyGetRequestsQuery();

  const [
    getAnnouncements,
    {
      data: announcements,
      isLoading: isGetAnnouncementLoading,
      error: isGetAnnouncementError,
    },
  ] = useLazyGetAnnouncementsQuery();

  const [
    getUsers,
    { data: users, isLoading: isGetUserLoading, error: isGetUserError },
  ] = useLazyGetUsersQuery();

  const [approveRejectRequest, { error: isCreateRequestError }] =
    useApproveRejectRequestMutation();

  const isLoading = isGetAnnouncementLoading && isGetRequestLoading;

  const userApprove = (requestId: string, requestStatus: boolean) => {
    approveRejectRequest({ requestId, requestStatus });
  };

  const renderApprovalStatus = (
    approval: boolean | null
  ): JSX.Element | null => {
    if (approval === null) {
      return <RemoveIcon />;
    } else if (approval === true) {
      return <CheckIcon />;
    } else if (approval === false) {
      return <CloseIcon />;
    }

    return null;
  };

  const handleSearch = useCallback(() => {
    getRequests(getRequestQueryParams);
  }, [
    page,
    userFilter,
    announcementFilter,
    actionType,
    approvedByLsc,
    approvedByBm,
  ]);

  const getUserDelayed = useMemo(() => {
    return debounce((query: string) => {
      getUsers({ query, limit: 5 }).then(({ data }) => {
        setUserFilterOptions(
          data !== undefined
            ? data.contents.map((u) => ({
                id: u.id,
                name: u.name,
              }))
            : []
        );
        setIsUserFilterLoading(false);
      });
    }, 250);
  }, [getUsers]);

  const getAnnouncementDelayed = useMemo(() => {
    return debounce((query: string) => {
      getAnnouncements({ query, limit: 5 }).then(({ data }) => {
        setAnnouncementFilterOptions(
          data !== undefined
            ? data.contents.map((a) => ({
                id: a.id,
                name: a.title,
              }))
            : []
        );
        setIsAnnouncementFilterLoading(false);
      });
    }, 250);
  }, [getAnnouncements]);

  const announcementOptions = announcements?.contents.map((content) => content);

  const announcementUniqueByKey = Array.from(
    new Map(
      announcementOptions?.map((announcement) => [
        announcement[key],
        announcement,
      ])
    ).values()
  );

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    [page]
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    [page]
  );

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!requests) return true;

    return page === requests.totalPages;
  }, [page, requests]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (isGetRequestError && "data" in isGetRequestError) {
      setErrorMessage((isGetRequestError.data as ApiErrorResponse).messages[0]);
    }
    if (isGetAnnouncementError && "data" in isGetAnnouncementError) {
      setErrorMessage(
        (isGetAnnouncementError.data as ApiErrorResponse).messages[0]
      );
    }
  }, [isGetRequestError, isGetAnnouncementError]);

  useEffect(() => {
    getRequests(getRequestQueryParams);
  }, [getRequests, page]);

  useEffect(() => {
    if (openUserFilter) {
      getUsers({ limit: 5 }).then(({ data }) => {
        setUserFilterOptions(
          data !== undefined
            ? data.contents.map((u) => ({
                id: u.id,
                name: u.name,
              }))
            : []
        );
      });
    }
  }, [getUsers, openUserFilter]);

  useEffect(() => {
    if (openAnnouncementFilter) {
      getAnnouncements({ limit: 5 }).then(({ data }) => {
        setAnnouncementFilterOptions(
          data !== undefined
            ? data.contents.map((u) => ({
                id: u.id,
                name: u.title,
              }))
            : []
        );
      });
    }
  }, [openAnnouncementFilter, getAnnouncements]);

  return (
    <Layout>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {!isLoading ? (
          <>
            <Box display="flex">
              <TextField
                id="filled-basic"
                label="Search by ID"
                variant="outlined"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ marginBottom: 2, width: 140 }}
              />
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <Autocomplete
                  disablePortal
                  id="author-filter"
                  open={openUserFilter}
                  onOpen={() => {
                    setOpenUserFilter(true);
                  }}
                  onClose={() => {
                    setOpenUserFilter(false);
                  }}
                  options={userFilterOptions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  sx={{ width: 150 }}
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
                  onChange={(_, newValue) => {
                    setUserFilterOptions([]);
                    setUserFilter(newValue);
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === "input") {
                      setUserFilterOptions([]);
                      getUserDelayed(newInputValue);
                      setIsUserFilterLoading(true);
                    }
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <Autocomplete
                  disablePortal
                  id="announcement-filter"
                  open={openAnnouncementFilter}
                  onOpen={() => {
                    setOpenAnnouncementFilter(true);
                  }}
                  onClose={() => {
                    setOpenAnnouncementFilter(false);
                  }}
                  options={announcementFilterOptions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Announcement"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isAnnouncementFilterLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  value={announcementFilter}
                  onChange={(_, newValue) => {
                    setAnnouncementFilterOptions([]);
                    setAnnouncementFilter(newValue);
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === "input") {
                      setAnnouncementFilterOptions([]);
                      getAnnouncementDelayed(newInputValue);
                      setIsAnnouncementFilterLoading(true);
                    }
                  }}
                />
              </Box>

              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <FormControl sx={{ width: 165 }}>
                  <InputLabel id="lsc_filter">Condition by LSC</InputLabel>
                  <Select
                    labelId="lsc_filter"
                    id="lsc_filter"
                    label="Condition by LSC"
                    value={approvedByLscText !== null ? approvedByLscText : ""}
                    onChange={(e: SelectChangeEvent) => {
                      if (e.target.value === "Approved") {
                        setApprovedByLsc(true);
                        setApprovedByLscText(e.target.value);
                      }
                      if (e.target.value === "Rejected") {
                        setApprovedByLsc(false);
                        setApprovedByLscText(e.target.value);
                      }
                      if (e.target.value === "All") {
                        setApprovedByLsc(null);
                        setApprovedByLscText(e.target.value);
                      }
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <FormControl sx={{ width: 165 }}>
                  <InputLabel id="">Condition by BM</InputLabel>
                  <Select
                    labelId="bm_filter"
                    id="bm_filter"
                    label="Condition by LSC"
                    value={approvedByBmText !== null ? approvedByBmText : ""}
                    onChange={(e: SelectChangeEvent) => {
                      if (e.target.value === "All") {
                        setApprovedByBm(null);
                        setApprovedByBmText(e.target.value);
                      }
                      if (e.target.value === "Approved") {
                        setApprovedByBm(true);
                        setApprovedByBmText(e.target.value);
                      }
                      if (e.target.value === "Rejected") {
                        setApprovedByBm(false);
                        setApprovedByBmText(e.target.value);
                      }
                    }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Button onClick={handleSearch} variant="contained" size="large">
                  Search
                </Button>
              </Box>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
              <Card sx={{ bgcolor: "#D2E4EF" }}>
                <CardActions>
                  {actions &&
                    actions.map((action, index) => (
                      <Button
                        key={index}
                        onClick={() => setActionType(action.value)}
                        variant={
                          actionType === action.value ? "contained" : "text"
                        }
                        sx={{ marginRight: 2 }}
                        value={actionType}
                      >
                        {action.label}
                      </Button>
                    ))}
                </CardActions>
              </Card>
            </Box>
            {requests && requests.contents.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="center">Announcement</TableCell>
                      <TableCell align="center">Author</TableCell>
                      <TableCell align="center">Action</TableCell>
                      <TableCell align="center">Description</TableCell>
                      <TableCell align="center">Created at</TableCell>
                      <TableCell align="center">LSC</TableCell>
                      <TableCell align="center">BM</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.contents.map((request) => (
                      <TableRow
                        key={request.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{request.id}</TableCell>
                        <TableCell align="center">
                          {request.announcement.title}
                        </TableCell>
                        <TableCell align="center">
                          {request.author.name}
                        </TableCell>
                        <TableCell align="center">
                          <Button variant="contained">
                            {request.action.label}
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          {request.description}
                        </TableCell>
                        <TableCell align="center">
                          {toDate(request.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          {renderApprovalStatus(request.approvalStatus.lsc)}
                        </TableCell>
                        <TableCell align="center">
                          {renderApprovalStatus(request.approvalStatus.bm)}
                        </TableCell>
                        <TableCell align="center">
                          {hasUpdateRequestApprovalPermission &&
                          (request.approvalStatus.bm === null ||
                            request.approvalStatus.lsc === null) ? (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                sx={{ marginRight: 1 }}
                                onClick={() =>
                                  userApprove(request.id.toString(), true)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  userApprove(request.id.toString(), false)
                                }
                              >
                                Reject
                              </Button>
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
          </>
        ) : (
          <Box display="flex" justifyContent="center" width="100%">
            <CircularProgress />
          </Box>
        )}
      </Box>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleClose}
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
    </Layout>
  );
};

export default RequestsPage;
