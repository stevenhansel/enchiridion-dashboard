import React, { useEffect, useState } from "react";

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
import { CircularProgress } from "@mui/material";

import { useLazyGetUsersQuery } from "../services/users";

const FETCH_LIMIT = 20;

const ListUsersPage = () => {
  const [getUsers, { data, isLoading, error }] = useLazyGetUsersQuery();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const getUsersQueryParams = { page, limit: FETCH_LIMIT, query };

  useEffect(() => {
    getUsers(getUsersQueryParams);
  }, [page]);

  return (
    <Box>
      {/* <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box display="flex">
          <TextField
            id="filled-basic"
            label="Search by ID"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            onChange={filterUsersById}
          />
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : foundUsers && foundUsers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="justify">Name</TableCell>
                  <TableCell align="justify">Email</TableCell>
                  <TableCell align="justify">Role</TableCell>
                  <TableCell align="justify">Status</TableCell>
                  <TableCell align="justify">Reason</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {foundUsers.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="justify">{row.name} </TableCell>
                    <TableCell align="justify">{row.email} </TableCell>
                    <TableCell align="justify">{row.role}</TableCell>
                    <TableCell align="justify">{row.status} </TableCell>
                    <TableCell align="justify">{row.reason} </TableCell>
                    <TableCell
                      align="justify"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <TableRow>
                    <Button variant="contained" sx={{marginRight: 1}}>Approve</Button>
                    <Button variant="contained">Reject</Button>
                      </TableRow>
                   </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No results found!</Typography>
        )}
      </Box> */}
    </Box>
  );
};

export default ListUsersPage;
