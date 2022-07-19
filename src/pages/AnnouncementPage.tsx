import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";

import axios from "../utils/axiosInstance";

type Props = {
  children?: React.ReactNode;
};

type Status = {
  value: string;
  label: string;
};

type Author = {
  id: number;
  name: string;
};

type Content = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  statuses: Status[];
  authors: Author[];
  media: string;
  createdAt: string;
};

type AnnouncementPage = {
  count: number;
  pages: number;
  hasNext: boolean;
  contents: Content[];
  title: string;
  media: string;
};

const AnnouncementPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [announcements, setAnnouncements] = useState<Content[]>([]);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<AnnouncementPage>("/v1/announcements");
      const announcements: Content[] = response.data.contents.map((data: any) => ({
        id: data.id,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        statuses: data.statuses,
        authors: data.authors,
        createdAt: data.createdAt,
        media: data.media,
      }));
      setAnnouncements(announcements);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response.data.message);
      setIsLoading(false);
    }
  };

  const updateApprovalStatus = async (id: number, approve: boolean) => {
    try {
      await axios.put(`/v1/announcements/${id}/approval`, { approve });
      fetchAnnouncements();
    } catch (err) {}
  };

  useEffect(() => {
    fetchAnnouncements();
    console.log(announcements);
  }, []);

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {isLoading ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Title</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Author</TableCell>
                    <TableCell align="right">Created At</TableCell>
                    <TableCell align="right">Media</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {announcements.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.title}</TableCell>
                      <TableCell align="right">{row.startDate}</TableCell>
                      <TableCell align="right">{row.endDate}</TableCell>
                      {row.statuses.map((status) => (
                        <TableRow
                          key={status.value}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="right">{status.label}</TableCell>
                        </TableRow>
                      ))}
                      {row.authors.map((author) => (
                        <TableRow
                          key={author.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="right">{author.name}</TableCell>
                        </TableRow>
                      ))}
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell align="right">
                        <img src={row.media} alt={row.title} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (<CircularProgress />)}
      </Box>
    </Box>
  );
};

export default AnnouncementPage;
