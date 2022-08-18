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

import {
  useGetAnnouncementsQuery,
  useLazyGetAnnouncementsQuery,
} from "../services/announcement";

import { AnnouncementRequest } from "../types/store";

type ActionButton = {
  label: string;
  value: string;
};

type Props = {
  children?: React.ReactNode;
};

const actions: ActionButton[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Change Date",
    value: "change date",
  },
  {
    label: "Delete",
    value: "delete",
  },
  {
    label: "Change Content",
    value: "change content",
  },
  {
    label: "Change Devices",
    value: "change devices",
  },
];

const toDate = (dateStr: string | undefined) =>
  dayjs(dateStr).format("DD MMM YYYY h:mm A");

const FETCH_LIMIT = 20;

const RequestsPage = (props: Props) => {
  const [selectByUser, setSelectByUser] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const getRequestQueryParams = {
    page,
    query,
    userId,
    limit: FETCH_LIMIT,
  };

  const [
    getRequests,
    {
      data: requestsData,
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
  }, [page, userId]);

  const announcementOptions = Array.from(
    new Set(announcementsData?.contents.map((content) => content.author.id))
  );

  const options = requestsData?.contents.map((content) => content.approvalStatus); // testing

  console.log(options); //testing

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
    if (!requestsData) return true;

    return page === requestsData.totalPages;
  }, [page, requestsData]);

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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <Autocomplete
                  disablePortal
                  id="announcement_filter"
                  options={announcementOptions}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Announcement" />
                  )}
                  value={userId}
                  onChange={(_: any, newValue: number | null) => 
                    setUserId(newValue)
                  }
                />
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <FormControl sx={{ width: 220 }}>
                  <InputLabel id="announcement_filter">
                    Condition by LSC
                  </InputLabel>
                  <Select
                    labelId="announcement_filter"
                    id="announcement_filter"
                    label="Condition by LSC"
                    defaultValue={""}
                  >
                    <MenuItem>Approved</MenuItem>
                    <MenuItem>Rejected</MenuItem>
                    <MenuItem>Unchecked</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" flexDirection="row" sx={{ marginLeft: 1 }}>
                <FormControl sx={{ width: 220 }}>
                  <InputLabel id="announcement_filter">
                    Condition by BM
                  </InputLabel>
                  <Select
                    labelId="announcement_filter"
                    id="announcement_filter"
                    label="Condition by LSC"
                    defaultValue={""}
                  >
                    <MenuItem>Approved</MenuItem>
                    <MenuItem>Rejected</MenuItem>
                    <MenuItem>Unchecked</MenuItem>
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
                    onClick={() => setSelectByUser(action.label)}
                    variant={
                      selectByUser === action.label ? "contained" : "outlined"
                    }
                    sx={{ marginRight: 2 }}
                    value={action.value}
                  >
                    {action.label}
                  </Button>
                ))}
            </Box>
            {requestsData && requestsData.contents.length > 0 ? (
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
                    {requestsData.contents.map((request) => (
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
                            onClick={() =>
                              userApprove(request.id.toString(), false)
                            }
                          >
                            Reject
                          </Button>
                          <Button
                            variant="outlined"
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
