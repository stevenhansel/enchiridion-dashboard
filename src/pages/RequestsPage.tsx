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
import ToggleButton from '@mui/material/ToggleButton';

type Request = {
  id: number;
  announcement: string;
  author: string;
  action: string;
  description: string;
  createdDate: string;
  approvalStatus: string[];
};

type FilterButton = {
  name: string;
  value: string;
};

type Props = {
  children?: React.ReactNode;
};

const requestsData: Request[] = [
  {
    id: 1,
    announcement: "Daftar Aslab",
    author: "Lukas Linardi",
    action: "create",
    description: "lorem ipsum",
    createdDate: "25-06-2022",
    approvalStatus: ["Approve", "Reject"],
  },
  {
    id: 2,
    announcement: "ya udah ganti bang",
    author: "Steven Hansel",
    action: "change date",
    description: "Change Date",
    createdDate: "25-06-2022",
    approvalStatus: ["Approve", "Reject"],
  },
  {
    id: 3,
    announcement: "alones",
    author: "Mom",
    action: "delete",
    description: "Delete Announcement",
    createdDate: "25-06-2022",
    approvalStatus: ["Approve", "Reject"],
  },
  {
    id: 4,
    announcement: "Bleach",
    author: "Dad",
    action: "change content",
    description: "Open Media",
    createdDate: "25-06-2022",
    approvalStatus: ["Approve", "Reject"],
  },
  {
    id: 5,
    announcement: "Weebo",
    author: "Andhika",
    action: "change devices",
    description: "See Devices Mappings",
    createdDate: "25-06-2022",
    approvalStatus: ["Approve", "Reject"],
  },
];

const buttons: FilterButton[] = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Create",
    value: "create",
  },
  {
    name: "Change Date",
    value: "change date",
  },
  {
    name: "Delete",
    value: "delete",
  },
  {
    name: "Change Content",
    value: "change content",
  },
  {
    name: "Change Devices",
    value: "change devices",
  },
];

const RequestsPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<Request[]>(requestsData);
  const [foundUsers, setFoundUsers] = useState(requests);


  const filterUsersById = (e: any) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const result = requests.filter((request) => {
        return request.id
          .toString()
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setFoundUsers(result);
    } else {
      setFoundUsers(requests);
    }
  };

  const filterButton = (selectByUser: any): any => {
   const filtered = requests.filter(request => request.action === selectByUser)

   return filtered;
  };

  const handleButtonFilter = (e: any) => {
    const selected = e.target.value;

    if (selected !== "all") {
      setFoundUsers(filterButton(selected));
    } else {
      setFoundUsers(requests);
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
        <Box sx={{ marginBottom: 1 }}>
          {buttons && buttons.map((button, index) => (
            <Button
              key={index}
              onClick={handleButtonFilter}
              variant="contained"
              sx={{ marginRight: 2 }}
              value={button.value}
            >
              {button.name}
            </Button>
          ))}
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : foundUsers && foundUsers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="justify">Announcement</TableCell>
                  <TableCell align="justify">Author</TableCell>
                  <TableCell align="justify">Action</TableCell>
                  <TableCell align="justify">Description</TableCell>
                  <TableCell align="justify">Created at</TableCell>
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
                    <TableCell align="justify">{row.announcement} </TableCell>
                    <TableCell align="justify">{row.author} </TableCell>
                    <TableCell align="justify">
                      <Button>{row.action}</Button>
                    </TableCell>
                    <TableCell align="justify">{row.description} </TableCell>
                    <TableCell align="justify">{row.createdDate} </TableCell>
                    <TableCell
                      align="justify"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {row.approvalStatus.map((approval) => (
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

export default RequestsPage;
