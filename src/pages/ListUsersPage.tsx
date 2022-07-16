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

type Users = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  reason: string;
  approvalButton: string[];
};

const usersData: Users[] = [
  {
    id: 1,
    name: "Lukas",
    email: "lukas.linardi@binus.ac.id",
    role: "Student",
    status: "Waiting for Approval",
    reason: "want to create hate speech",
    approvalButton: ["Approved", "Reject"],
  },
  {
    id: 2,
    name: "Steven",
    email: "steven.hansel@binus.ac.id",
    role: "Admin",
    status: "Approved",
    reason: "test",
    approvalButton: ["Approved", "Reject"],
  },
];

const ListUsersPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Users[]>(usersData);
  const [foundUsers, setFoundUsers] = useState(users);
  
  const filterUsersById = (e: any) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const result = users.filter((user) => {
        return (
          user.id.toString().startsWith(keyword) ||
          user.name.toLowerCase().startsWith(keyword.toLowerCase())
        );
      });
      setFoundUsers(result);
    } else {
      setFoundUsers(users);
    }
  };

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
                      {row.approvalButton.map((approval) => (
                        <TableRow
                          key={approval}
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Button variant="outlined" sx={{ marginRight: 1 }}>
                            {approval}
                          </Button>
                        </TableRow>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No results found!</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ListUsersPage;
