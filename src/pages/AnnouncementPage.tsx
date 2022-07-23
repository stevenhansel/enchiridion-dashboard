import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";

import { AppDispatch, RootState } from "../store";

import { announcementApi } from "../services/announcement";
import { ApiErrorResponse } from "../services";

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
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const fetchAnnouncements = async (): Promise<void> => {
    setIsLoading(true);
    const response = await dispatch(
      announcementApi.endpoints.getAnnouncements.initiate("")
    );
    if ("data" in response) {
      const announcementData: Content[] = response.data.contents.map(
        (data: any) => ({
          id: data.id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          media: data.media,
        })
      );
      setAnnouncements(announcementData);
      setIsLoading(false);
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }
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
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default AnnouncementPage;
