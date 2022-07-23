import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import ViewAnnouncementImageModal from '../components/ViewAnnouncementImageModal';

import { AppDispatch } from "../store";

import { announcementApi } from "../services/announcement";
import { ApiErrorResponse } from "../services";

import { Announcement } from '../types/store';

type Props = {
  children?: React.ReactNode;
};

const toDate = (dateStr: string) => new Date(dateStr).toDateString();

const AnnouncementPage = (props: Props) => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState<string>('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch: AppDispatch = useDispatch();

  const fetchAnnouncements = async (): Promise<void> => {
    setIsLoading(true);

    const response = await dispatch(
      announcementApi.endpoints.getAnnouncements.initiate("")
    );

    if ("data" in response) {
      const announcementData: Announcement[] = response.data.contents.map(
        (data: Announcement) => ({
          id: data.id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          author: data.author,
          createdAt: data.createdAt,
          media: data.media,
        })
      );
      setAnnouncements(announcementData);
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }

    setIsLoading(false);
  };

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {!isLoading ? (
          <>
            <Box display="flex">
              <Box>
                <TextField
                  id="search"
                  label="Search by floorname or ID"
                  variant="outlined"
                  onChange={(e) => {
                    //setFilterById(e.target.value);
                  }}
                  sx={{ width: 220 }}
                />
              </Box>
              <Box sx={{ marginLeft: 1 }}>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="100%"
              >
                <Button variant="contained" onClick={() => navigate('/announcement/create')}>
                  Create
                </Button>
              </Box>
            </Box>
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
                      <TableCell align="right">{toDate(row.startDate)}</TableCell>
                      <TableCell align="right">{toDate(row.endDate)}</TableCell>
                      <TableCell align="right">{row.status.label}</TableCell>
                      <TableCell align="right">{row.author.name}</TableCell>
                      <TableCell align="right">{toDate(row.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleSelectAnnouncementImage(row.id)}>
                          Open
                        </Button>
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
      <ViewAnnouncementImageModal
        announcementId={currentAnnouncementId}
        open={imageModalOpen}
        setOpen={setImageModalOpen}
      />
    </Box>
  );
};

export default AnnouncementPage;
