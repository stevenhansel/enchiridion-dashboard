import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";

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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import {
  useCreateRequestMutation,
  useLazyGetRequestsQuery,
} from "../services/request";

import { useLazyGetAnnouncementsQuery } from "../services/announcement";

import { Author, AnnouncementRequest } from "../types/store";

import { actions } from '../types/constants';

type Props = {
  children?: React.ReactNode;
};

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const FETCH_LIMIT = 20;

const key = "id";

const RequestsPage = (props: Props) => {
  const [actionType, setActionType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [userText, setUserText] = useState<Author | null>(null);
  const [announcementId, setAnnouncementId] = useState<number | null>(null);
  const [announcementText, setAnnouncementText] =
    useState<AnnouncementRequest | null>(null);
  const [approvedByLsc, setApprovedByLsc] = useState<boolean | null>(null);
  const [approvedByBm, setApprovedByBm] = useState<boolean | null>(null);

  const getRequestQueryParams = {
    page,
    query,
    userId,
    announcementId,
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
      error: getRequestError,
    },
  ] = useLazyGetRequestsQuery();

  const [
    getAnnouncements,
    {
      data: announcementsData,
      isLoading: isGetAnnouncementLoading,
      error: getAnnouncementError,
    },
  ] = useLazyGetAnnouncementsQuery();
  const [createRequest] = useCreateRequestMutation();

  const isLoading = isGetAnnouncementLoading && isGetRequestLoading;

  const userApprove = (requestId: string, requestStatus: boolean) => {
    createRequest({ requestId, requestStatus });
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
    getAnnouncements(getRequestQueryParams);
  }, [page, userId, announcementId, actionType, approvedByLsc, approvedByBm]);

  const authorOptions = announcementsData?.contents.map(
    (content) => content.author
  );

  const authorUniqueByKey = Array.from(
    new Map(authorOptions?.map((author) => [author[key], author])).values()
  );

  const announcementOptions = announcementsData?.contents.map(
    (content) => content
  );

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

  useEffect(() => {
    if (getRequestError) {
      setErrorMessage("Requests Not Found!");
    } else if (getAnnouncementError) {
      setErrorMessage("Announcement Not Found!");
    }
  }, [getRequestError, getAnnouncementError]);

  useEffect(() => {
    getRequests(getRequestQueryParams);
  }, [page]);

  useEffect(() => {
    getAnnouncements(null);
  }, []);

  return (
    <Box>
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
                  options={authorUniqueByKey}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Author" />
                  )}
                  value={userText}
                  onChange={(_: any, newValue: Author | null) => {
                    if (newValue?.id && newValue?.name) {
                      setUserId(newValue.id);
                      setUserText(newValue);
                    } else {
                      setUserId(null);
                      setUserText(null);
                    }
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <Autocomplete
                  disablePortal
                  id="announcement_filter"
                  options={announcementUniqueByKey}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  sx={{ width: 160 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Announcement" />
                  )}
                  value={announcementText}
                  onChange={(_: any, newValue: AnnouncementRequest | null) => {
                    if (newValue?.id && newValue?.title) {
                      setAnnouncementId(newValue.id);
                      setAnnouncementText(newValue);
                    } else {
                      setAnnouncementId(null);
                      setAnnouncementText(null);
                    }
                  }}
                />
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <FormControl sx={{ width: 165 }}>
                  <InputLabel id="announcement_filter">
                    Condition by LSC
                  </InputLabel>
                  <Select
                    labelId="announcement_filter"
                    id="announcement_filter"
                    label="Condition by LSC"
                    onChange={(e: SelectChangeEvent) => {
                      if (e.target.value === "Approved") {
                        setApprovedByLsc(true);
                      }
                      if (e.target.value === "Rejected") {
                        setApprovedByLsc(false);
                      }
                      if (e.target.value === "All") {
                        setApprovedByLsc(null);
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
                  <InputLabel id="announcement_filter">
                    Condition by BM
                  </InputLabel>
                  <Select
                    labelId="announcement_filter"
                    id="announcement_filter"
                    label="Condition by LSC"
                    onChange={(e: SelectChangeEvent) => {
                      if (e.target.value === "All") {
                        setApprovedByBm(null);
                      }
                      if (e.target.value === "Approved") {
                        setApprovedByBm(true);
                      }
                      if (e.target.value === "Rejected") {
                        setApprovedByBm(false);
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
                <Button onClick={handleSearch} variant="contained">
                  Search
                </Button>
              </Box>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
              {actions &&
                actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => setActionType(action.label)}
                    variant={
                      actionType === action.label ? "contained" : "outlined"
                    }
                    sx={{ marginRight: 2 }}
                    value={actionType}
                  >
                    {action.value}
                  </Button>
                ))}
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
                          <Button
                            variant="contained"
                            sx={{ marginRight: 1 }}
                            color="error"
                            onClick={() =>
                              userApprove(request.id.toString(), false)
                            }
                          >
                            Reject
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() =>
                              userApprove(request.id.toString(), true)
                            }
                          >
                            Approve
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
        action={action}
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
    </Box>
  );
};

export default RequestsPage;
