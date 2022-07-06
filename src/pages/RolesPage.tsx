import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ListPermission from "../components/ListPermission";

type RolesType = {
  id: number;
  role: string;
  description: string;
  permission: string;
};

const permission = "permission";

const personnels:RolesType[] = [
  {
    id: 1,
    role: "LSC",
    description: "Want to create announcement for lab assistant",
    permission,
  },
  {
    id: 2,
    role: "BM",
    description: "Want to create a hate speech",
    permission,
  },
];

const RolesPage = () => {
  const [open, setOpen] = useState(false);
  const [foundUsers, setFoundUsers] = useState(personnels);

  const filterUsers = (e: any) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const result = personnels.filter((personnel) => {
        return personnel.role.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundUsers(result);
    } else {
      setFoundUsers(personnels);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle display="flex" justifyContent="center">
            LIST OF PERMISSIONS
          </DialogTitle>
          <DialogContent>
            <ListPermission />
            <Box display="flex" justifyContent="center">
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleClose}
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      </>
      <TextField
        id="filled-basic"
        label="Outlined"
        variant="outlined"
        sx={{ marginBottom: 2 }}
        onChange={filterUsers}
      />
      {foundUsers && foundUsers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="justify">ID</TableCell>
                <TableCell align="justify">Role</TableCell>
                <TableCell align="justify" >Descriptions</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {foundUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell
                  >
                    {user.description}
                  </TableCell>
                  <TableCell align="justify">
                    <Button sx={{display: "flex", justifyContent: "center", width: "100%"}} variant="contained" onClick={handleOpen}>
                      {user.permission}
                    </Button>
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
  );
};

export default RolesPage;
