import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
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
  Snackbar,
  IconButton,
  Autocomplete,
  Typography,
} from "@mui/material";
import ViewAnnouncementImageModal from "../components/ViewAnnouncementImageModal";
import CloseIcon from "@mui/icons-material/Close";

import { useGetAnnouncementsQuery } from "../services/announcement";

type Status = {
  label: string;
  value: string;
};

const statuses: Status[] = [
  {
    label: "Waiting for Status",
    value: "waiting for status",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Canceled",
    value: "canceled",
  },
  {
    label: "Done",
    value: "done",
  },
];

const toDate = (dateStr: string) => dayjs(dateStr).format("DD MM YYYY");

const ListAnnouncementPage = () => {
  const navigate = useNavigate();

  const {
    data: announcementHash,
    isLoading,
    error,
  } = useGetAnnouncementsQuery(null);

  const [currentAnnouncementId, setCurrentAnnouncementId] =
    useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [filterById, setFilterById] = useState("");
  const [filterByAuthor, setFilterByAuthor] = useState<string | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectAnnouncementImage = (announcementId: number) => {
    setCurrentAnnouncementId(announcementId.toString());
    setImageModalOpen(true);
  };

  const handleNavigateToDetailPage = (announcementId: number) => {
    navigate(`/announcement/detail/${announcementId}`);
  };

  const filteredAnnouncement = announcementHash
    ? Object.values(announcementHash).filter(
        (announcement) =>
          ((announcement.title
            .toLowerCase()
            .startsWith(filterById.toLowerCase()) ||
            announcement.id.toString().startsWith(filterById)) 
            &&
            (filterByAuthor === announcement.author.name ||
              filterByAuthor === null) 
              &&
            filterByStatus === announcement.status.label) ||
          filterByStatus === null
      )
    : [];

  const announcementOptions = announcementHash
    ? Object.values(announcementHash).map(
        (announcement) => announcement.author.name
      )
    : [];

  const statusOptions = statuses ? statuses.map((status) => status.label) : [];

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

  useEffect(() => {
    if (error) {
      setErrorMessage("Announcements List Not Found");
    }
  }, [error]);

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
                  label="Search by title or ID"
                  variant="outlined"
                  onChange={(e) => {
                    setFilterById(e.target.value);
                  }}
                  sx={{ width: 220 }}
                />
              </Box>
              <Box sx={{ marginLeft: 1 }}>
                <Autocomplete
                  options={announcementOptions}
                  renderInput={(params) => (
                    <TextField {...params} label="Author" />
                  )}
                  value={filterByAuthor}
                  onChange={(_: any, newValue: string | null) =>
                    setFilterByAuthor(newValue)
                  }
                  sx={{ width: 150 }}
                />
              </Box>
              <Box sx={{ marginLeft: 1 }}>
                <Autocomplete
                  options={statusOptions}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" />
                  )}
                  value={filterByStatus}
                  onChange={(_: any, newValue: string | null) =>
                    setFilterByStatus(newValue)
                  }
                  sx={{ width: 150 }}
                />
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="100%"
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/announcement/create")}
                >
                  + Create
                </Button>
              </Box>
            </Box>
            {filteredAnnouncement && filteredAnnouncement.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="center">Title</TableCell>
                      <TableCell align="center">Start Date</TableCell>
                      <TableCell align="center">End Date</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Author</TableCell>
                      <TableCell align="center">Created At</TableCell>
                      <TableCell align="center">Media</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAnnouncement &&
                      filteredAnnouncement.map((announcement) => (
                        <TableRow
                          key={announcement.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {announcement.id}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                handleNavigateToDetailPage(announcement.id)
                              }
                            >
                              {announcement.title}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            {toDate(announcement.startDate)}
                          </TableCell>
                          <TableCell align="center">
                            {toDate(announcement.endDate)}
                          </TableCell>
                          <TableCell align="center">
                            {announcement.status.label}
                          </TableCell>
                          <TableCell align="center">
                            {announcement.author.name}
                          </TableCell>
                          <TableCell align="center">
                            {toDate(announcement.createdAt)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                handleSelectAnnouncementImage(announcement.id)
                              }
                            >
                              Open
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Not Found!</Typography>
            )}
          </>
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </Box>
      <ViewAnnouncementImageModal
        announcementId={currentAnnouncementId}
        open={imageModalOpen}
        setOpen={setImageModalOpen}
      />
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
        action={action}
      />
    </Box>
  );
};

export default ListAnnouncementPage;
