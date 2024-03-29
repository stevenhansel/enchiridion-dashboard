import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import {
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  Button,
  Typography,
  TextField,
  Snackbar,
  IconButton,
  Autocomplete,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import {
  useLazyGetUsersQuery,
  useApproveRejectUserMutation,
} from '../services/user';
import { useLazyGetRolesQuery } from '../services/roles';
import { ApiErrorResponse } from '../services/error';
import usePermission from '../hooks/usePermission';

const FETCH_LIMIT = 20;

type RoleFilterOption = {
  value: string;
  name: string;
  description: string;
};

const ListUsersPage = () => {
  const [
    getUsers,
    { data: users, isLoading: isUserLoading, error: isUserError },
  ] = useLazyGetUsersQuery();
  const [getRoles, { isLoading: isRoleLoading, error: isRoleError }] =
    useLazyGetRolesQuery();
  const [approveRejectUser, { error: isApproveRejectUserError }] =
    useApproveRejectUserMutation();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [roleFilterOptions, setRoleFilterOptions] = useState<
    RoleFilterOption[]
  >([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption | null>(null);
  const [isRoleFilterLoading, setIsRoleFilterLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const userQueryParams = searchParams.get('userQueryParams');
  const roleQueryParams = searchParams.get('roleQueryParams');
  const statusQueryParams = searchParams.get('statusQueryParams');

  const getUsersQueryParams = useMemo(
    () => ({
      page,
      limit: FETCH_LIMIT,
      query,
      role: roleFilter !== null ? roleFilter.value : '',
      status,
    }),
    [page, query, roleFilter, status]
  );
  const isLoading = isUserLoading && isRoleLoading;

  const handleSearch = useCallback(() => {
    if (query === '' && roleFilter === null && status === '') {
      setSearchParams({});
    } else {
      setSearchParams({
        userQueryParams: query,
        roleQueryParams: roleFilter !== null ? roleFilter.value : '',
        statusQueryParams: status,
      });
    }
    getUsers(getUsersQueryParams);
  }, [query, status, roleFilter]);

  const handlePaginationPreviousPage = useCallback(
    () => setPage(page => page - 1),
    [page]
  );

  const handlePaginationNextPage = useCallback(
    () => setPage(page => page + 1),
    [page]
  );

  const getRoleDelayed = useMemo(() => {
    return debounce((query: string) => {
      getRoles({ query, limit: 5 }).then(({ data }) => {
        setRoleFilterOptions(
          data !== undefined
            ? data.map(r => ({
                name: r.name,
                value: r.value,
                description: r.description,
              }))
            : []
        );
        setIsRoleFilterLoading(false);
      });
    }, 250);
  }, [getRoles]);

  const userApprove = (userId: string, userStatus: boolean) => {
    approveRejectUser({ userId, userStatus });
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  const isPreviousButtonDisabled = useMemo(() => page === 1, [page]);
  const isNextButtonDisabled = useMemo(() => {
    if (!users) return true;

    return page === users.totalPages;
  }, [page, users]);

  const hasPermissionUpdateUserApproval = usePermission('update_user_approval');

  useEffect(() => {
    getUsers(getUsersQueryParams);
  }, [page]);

  useEffect(() => {
    if (open) {
      getRoles({ limit: 5, query: roleFilter?.name }).then(({ data }) => {
        setRoleFilterOptions(
          data !== undefined
            ? data.map(r => ({
                name: r.name,
                value: r.value,
                description: r.description,
              }))
            : []
        );
      });
    }
  }, [getRoles, open]);

  useEffect(() => {
    if (isUserError && 'data' in isUserError) {
      setErrorMessage((isUserError.data as ApiErrorResponse).messages[0]);
    }
    if (isApproveRejectUserError && 'data' in isApproveRejectUserError) {
      setErrorMessage(
        (isApproveRejectUserError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isRoleError && 'data' in isRoleError) {
      setErrorMessage((isRoleError.data as ApiErrorResponse).messages[0]);
    }
  }, [isUserError]);

  useEffect(() => {
    getUsers({
      query: userQueryParams,
      role: roleQueryParams,
      status: statusQueryParams,
    });
  }, [userQueryParams, roleQueryParams, statusQueryParams]);

  return (
    <>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          List User Page
        </Typography>
      </Box>
      <Box>
        <Box display="flex">
          <TextField
            id="filled-basic"
            label="Search by ID or Name"
            variant="outlined"
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{ marginBottom: 1, marginRight: 1 }}
          />
          <Box>
            <Autocomplete
              options={roleFilterOptions}
              loading={isRoleLoading}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              onChange={(_, newValue) => {
                setRoleFilter(newValue);
                setRoleFilterOptions([]);
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === 'input') {
                  getRoleDelayed(newInputValue);
                  setRoleFilterOptions([]);
                  setIsRoleFilterLoading(true);
                }
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.value}>
                    {option.name}
                  </li>
                );
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Role"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isRoleFilterLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              value={roleFilter}
              sx={{ width: 150, marginRight: 1 }}
            />
          </Box>
          <Box sx={{ width: 250 }}>
            <FormControl fullWidth>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                value={status}
                label="Status"
                onChange={(e: SelectChangeEvent) => {
                  setStatus(e.target.value as string);
                }}
              >
                <MenuItem value={''}>None</MenuItem>
                <MenuItem value={'waiting_for_approval'}>
                  Waiting for Approval
                </MenuItem>
                <MenuItem value={'approved'}>Approved</MenuItem>
                <MenuItem value={'rejected'}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={handleSearch}
              size="large"
              sx={{ marginLeft: 1 }}
            >
              Search
            </Button>
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : users && users.contents.length > 0 ? (
          <>
            <TableContainer component={Paper} sx={{ width: '100%' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users &&
                    users.contents.map(profile => (
                      <TableRow
                        key={profile.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell align="center" component="th" scope="row">
                          {profile.id}
                        </TableCell>
                        <TableCell align="center">{profile.name} </TableCell>
                        <TableCell align="center">{profile.email} </TableCell>
                        <TableCell align="center">
                          {profile.role.name}
                        </TableCell>
                        <TableCell align="center">
                          {profile.status.label}
                        </TableCell>
                        <TableCell align="center">
                          {profile.status.value === 'approved' &&
                          hasPermissionUpdateUserApproval ? null : (
                            <>
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
                            </>
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
    </>
  );
};

export default ListUsersPage;
