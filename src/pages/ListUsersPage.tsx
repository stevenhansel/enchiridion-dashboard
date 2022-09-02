import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import {
  useLazyGetUsersQuery,
  useApproveRejectUserMutation,
} from "../services/user";
import { useLazyGetRolesQuery } from "../services/roles";

import { Role } from "../types/store";
import Layout from "../components/Layout";
import { ApiErrorResponse } from "../services/error";

import { RootState } from "../store";

const FETCH_LIMIT = 20;
const key = "value";

const ListUsersPage = () => {
  const [
    getUsers,
    { data: users, isLoading: isUserLoading, error: isUserError },
  ] = useLazyGetUsersQuery();
  const [
    getRoles,
    { data: roles, isLoading: isRoleLoading, error: isRoleError },
  ] = useLazyGetRolesQuery();
  const [approveRejectUser] = useApproveRejectUserMutation();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<Role | null>(null);

  const getUsersQueryParams = { page, limit: FETCH_LIMIT, query, role, status };

  const isLoading = isUserLoading && isRoleLoading;

  const profile = useSelector((p: RootState) => p.profile);

  const handleSearch = useCallback(() => {
    getUsers(getUsersQueryParams);
  }, [query, role, status]);

  const handlePaginationPreviousPage = useCallback(
    () => setPage((page) => page - 1),
    [page]
  );

  const handlePaginationNextPage = useCallback(
    () => setPage((page) => page + 1),
    [page]
  );

  const userApprove = (userId: string, userStatus: boolean) => {
    approveRejectUser({ userId, userStatus });
  };

  const roleOptions = Array.from(new Set(roles?.map((option) => option)));

  const roleUniqueByKey = Array.from(
    new Map(roleOptions.map((role) => [role[key], role])).values()
  );

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
    if (!users) return true;

    return page === users.totalPages;
  }, [page, users]);

  const hasPermission = useMemo(() => {
    if (!profile) return false;
    const { role } = profile;

    const permissions = role.permissions.map((permission) => permission.value);

    if (permissions.includes("update_user_approval")) {
      return false;
    }
    return true;
  }, [profile]);

  useEffect(() => {
    getUsers(getUsersQueryParams);
    getRoles(null);
  }, [page]);

  useEffect(() => {
    if (isUserError && "data" in isUserError) {
      setErrorMessage((isUserError.data as ApiErrorResponse).messages[0]);
    }
  }, [isUserError]);

  console.log(status);

  return (
    <Layout>
      <Box>
        <Box display="flex">
          <TextField
            id="filled-basic"
            label="Search by ID"
            variant="outlined"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ marginBottom: 2, marginRight: 1 }}
          />
          <Box>
            <Autocomplete
              options={roleUniqueByKey}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              onChange={(_: any, newValue: Role | null) => {
                if (newValue?.value && newValue?.name) {
                  setRole(newValue.value);
                  setRoleName(newValue);
                } else {
                  setRole(null);
                  setRoleName(null);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Role" />}
              value={roleName}
              sx={{ width: 150, marginRight: 1 }}
            />
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={status}
                label="Age"
                onChange={(e: SelectChangeEvent) => {
                  setStatus(e.target.value as string);
                }}
              >
                <MenuItem value={""}>None</MenuItem>
                <MenuItem value={"waiting_for_approval"}>
                  Waiting for Approval
                </MenuItem>
                <MenuItem value={"approved"}>Approved</MenuItem>
                <MenuItem value={"rejected"}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : users && users.contents.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.contents.map((profile) => (
                    <TableRow
                      key={profile.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {profile.id}
                      </TableCell>
                      <TableCell align="center">{profile.name} </TableCell>
                      <TableCell align="center">{profile.email} </TableCell>
                      <TableCell align="center">{profile.role.name}</TableCell>
                      <TableCell align="center">
                        {profile.status.label}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        {profile.status.value === "approved" ||
                        hasPermission ? null : (
                          <Box>
                            <Button
                              variant="contained"
                              color="success"
                              sx={{ marginRight: 1 }}
                              onClick={() =>
                                userApprove(profile.id.toString(), true)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() =>
                                userApprove(profile.id.toString(), false)
                              }
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              sx={{ marginTop: 1 }}
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
          <Typography>No results found!</Typography>
        )}
      </Box>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
        action={action}
      />
    </Layout>
  );
};

export default ListUsersPage;
