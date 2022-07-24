import React, { useState } from "react";
import dayjs from 'dayjs';
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

import { useGetAnnouncementsQuery } from "../services/announcement";

const toDate = (dateStr: string) => dayjs(dateStr).format('DD MM YYYY');

const ListAnnouncementPage = () => {
  const navigate = useNavigate();

  const { data: announcementHash, isLoading } = useGetAnnouncementsQuery(null);

  const [currentAnnouncementId, setCurrentAnnouncementId] = useState<string>('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  }

  const handleNavigateToDetailPage = (announcementId: number) => {
    navigate(`/announcement/detail/${announcementId}`);
  }

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
                  {announcementHash && Object.entries(announcementHash).map(([announcementId, announcement]) => (
                    <TableRow
                      key={announcementId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {announcementId}
                      </TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleNavigateToDetailPage(announcement.id)}>
                          {announcement.title}
                        </Button>
                      </TableCell>
                      <TableCell align="right">{toDate(announcement.startDate)}</TableCell>
                      <TableCell align="right">{toDate(announcement.endDate)}</TableCell>
                      <TableCell align="right">{announcement.status.label}</TableCell>
                      <TableCell align="right">{announcement.author.name}</TableCell>
                      <TableCell align="right">{toDate(announcement.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleSelectAnnouncementImage(announcement.id)}>
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

export default ListAnnouncementPage;
