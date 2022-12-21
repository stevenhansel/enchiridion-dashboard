import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogTitle,
  Dialog,
  DialogContent,
  Snackbar,
  IconButton,
} from "@mui/material";

import {
  Check as CheckIcon,
  Close as CloseIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

import { useGetAnnouncementDetailQuery } from "../services/announcement";
import { useGetBuildingsQuery } from "../services/building";
import { useLazyGetFloorsQuery } from "../services/floor";
import { useLazyGetRequestsQuery } from "../services/request";
import { ApiErrorResponse } from "../services/error";

import CreateRequestModal from "../components/CreateRequestModal";
import DeleteAnnouncementRequest from "../components/DeleteAnnouncementRequest";

import { usePermission } from "../hooks";

const toDate = (dateStr: string) => dayjs(dateStr).format("DD MMM YYYY");

const AnnouncementDetailPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { announcementId = "" } = useParams();
  const hasCreateRequestPermission = usePermission("create_request");

  const hasViewAnnouncementDetailPermission = usePermission(
    "view_announcement_detail"
  );
  const [open, setOpen] = useState(false);
  const [openDeleteAnnouncementModal, setOpenDeleteAnnouncementModal] =
    useState(false);
  const [currentBuildingId, setCurrentBuildingId] = useState<string>("");

  const {
    data: buildings,
    isLoading: isBuildingLoading,
    error: isGetBuildingError,
  } = useGetBuildingsQuery(null);

  const [
    getFloors,
    { data: floors, isLoading: isGetFloorsLoading, error: isGetFloorError },
  ] = useLazyGetFloorsQuery();

  const {
    data: announcements,
    isLoading: isGetAnnouncementDetailLoading,
    error: isGetAnnouncementDetailError,
  } = useGetAnnouncementDetailQuery(
    { announcementId },
    {
      skip: announcementId === "",
    }
  );

  const [
    getRequests,
    {
      data: requests,
      error: isGetRequestError,
      isLoading: isGetRequestLoading,
    },
  ] = useLazyGetRequestsQuery();

  const isLoading =
    isBuildingLoading ||
    isGetFloorsLoading ||
    isGetAnnouncementDetailLoading ||
    isGetRequestLoading;

  const renderApprovalStatus = (
    approval: boolean | null
  ): JSX.Element | null => {
    if (approval === null) {
      return <RemoveIcon />;
    } else if (approval === true) {
      return <CheckIcon />;
    } else if (approval === false) {
      return <CloseIcon />;
    }
    return null;
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    if (
      buildings !== undefined &&
      isBuildingLoading === false &&
      buildings.length > 0
    ) {
      const firstBuildingId = buildings[0].id;
      setCurrentBuildingId(firstBuildingId.toString());
    }
  }, [buildings]);

  useEffect(() => {
    getRequests({
      announcementId: announcements !== null ? announcements?.id : null,
    });
  }, [announcements?.id]);

  useEffect(() => {
    getFloors(null);
  }, []);

  useEffect(() => {
    if (isGetBuildingError && "data" in isGetBuildingError) {
      setErrorMessage(
        (isGetBuildingError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetFloorError && "data" in isGetFloorError) {
      setErrorMessage((isGetFloorError.data as ApiErrorResponse).messages[0]);
    }
    if (
      isGetAnnouncementDetailError &&
      "data" in isGetAnnouncementDetailError
    ) {
      setErrorMessage(
        (isGetAnnouncementDetailError.data as ApiErrorResponse).messages[0]
      );
    }
    if (isGetRequestError && "data" in isGetRequestError) {
      setErrorMessage((isGetRequestError.data as ApiErrorResponse).messages[0]);
    }
  }, [
    isGetBuildingError,
    isGetFloorError,
    isGetAnnouncementDetailError,
    isGetRequestError,
  ]);

  const media = () => {
    if (announcements === undefined) {
      return null;
    }
    if (announcements.mediaType === "image") {
      return (
        <img alt="banner" src={announcements.media} style={{ width: "100%" }} />
      );
    } else if (announcements.mediaType === "video") {
      return (
        <Box display="flex" justifyContent="center">
          <video
            src={announcements.media}
            style={{ width: "50%" }}
            controls
            loop
            autoPlay
            muted
          />
        </Box>
      );
    }
  };

  return (
    <>
      {hasViewAnnouncementDetailPermission ? (
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            {isLoading && <CircularProgress />}
            {!isLoading && (
              <Box
                sx={{
                  marginTop: 5,
                  p: 2,
                }}
              >
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="h2" align="center">
                    {announcements?.title}
                  </Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>{media()}</Box>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold">Start Date</Typography>
                    <Typography>{toDate(announcements!.startDate)}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold">End Date</Typography>
                    <Typography>{toDate(announcements!.endDate)}</Typography>
                    <CreateRequestModal
                      date={new Date(announcements!.endDate)}
                      open={open}
                      setOpen={setOpen}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography display="flex" fontWeight="bold">
                    Author
                  </Typography>
                  <Typography>{announcements!.author.name}</Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography display="flex" fontWeight="bold">
                    Notes
                  </Typography>
                  <Typography>{announcements!.notes}</Typography>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography display="flex" fontWeight="bold">
                    Status
                  </Typography>
                  <Typography>{announcements!.status.label}</Typography>
                </Box>
                <Typography display="flex" fontWeight="bold">
                  Device
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid #c4c4c4",
                      marginBottom: 2,
                    }}
                  >
                    <Box
                      sx={{
                        padding: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {buildings &&
                        buildings.map((building) => (
                          <Button
                            key={building.id}
                            onClick={() =>
                              setCurrentBuildingId(building.id.toString())
                            }
                            variant={
                              currentBuildingId === building.id.toString()
                                ? "contained"
                                : "text"
                            }
                            color={
                              currentBuildingId === building.id.toString()
                                ? "secondary"
                                : "inactive"
                            }
                            sx={{ marginBottom: 1 }}
                          >
                            {building.name}
                          </Button>
                        ))}
                    </Box>
                    <Box sx={{ borderLeft: "1px solid #c4c4c4" }} />
                    <Box
                      sx={{
                        padding: 3,
                        flex: 1,
                      }}
                    >
                      <Box>
                        {floors?.contents
                          .filter(
                            (floor) =>
                              currentBuildingId === floor.building.id.toString()
                          )
                          .map((floor) => (
                            <Box
                              key={floor.id}
                              display="flex"
                              sx={{
                                border: "1px solid #c4c4c4",
                                marginBottom: 1,
                              }}
                              alignItems="center"
                            >
                              <Box
                                sx={{
                                  minWidth: 100,
                                  // flex: 1,
                                  marginRight: 1,
                                  marginBottom: 2,
                                  margin: 1,
                                }}
                              >
                                {floor.name}
                              </Box>
                              <Box sx={{ maxWidth: "500px" }}>
                                {floor.devices.map((device) => (
                                  <Tooltip
                                    key={device.id}
                                    title={device.description}
                                  >
                                    <Button
                                      variant="contained"
                                      color={
                                        announcements!.devices
                                          .map(
                                            (announcementDevice) =>
                                              announcementDevice.id
                                          )
                                          .includes(device.id)
                                          ? "secondary"
                                          : "inactive"
                                      }
                                      sx={{
                                        margin: 1,
                                        width: 140,
                                      }}
                                    >
                                      {device.name}
                                    </Button>
                                  </Tooltip>
                                ))}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography display="flex" fontWeight="bold">
                    Request
                  </Typography>
                  {hasCreateRequestPermission &&
                  announcements?.status.value === "active" ? (
                    <>
                      <Button
                        onClick={() => {
                          setOpen(true);
                        }}
                        variant="contained"
                        size="large"
                        sx={{ marginRight: 1 }}
                      >
                        + Create Request
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setOpenDeleteAnnouncementModal(true)}
                      >
                        Delete Request
                      </Button>
                      <Dialog
                        open={openDeleteAnnouncementModal}
                        onClose={() => setOpenDeleteAnnouncementModal(false)}
                      >
                        <DialogTitle>Delete Announcement Request</DialogTitle>
                        <DialogContent>
                          <DeleteAnnouncementRequest
                            setOpen={setOpenDeleteAnnouncementModal}
                          />
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : null}
                </Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="center">Announcement</TableCell>
                        <TableCell align="center">Author</TableCell>
                        <TableCell align="center">Action</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Created at</TableCell>
                        <TableCell align="center">LSC</TableCell>
                        <TableCell align="center">BM</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests &&
                        requests.contents.map((request) => (
                          <TableRow
                            key={request.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{request.id}</TableCell>
                            <TableCell align="center">
                              {request.announcement.title}
                            </TableCell>
                            <TableCell align="center">
                              {request.author.name}
                            </TableCell>
                            <TableCell align="center">
                              <Button variant="contained">
                                {request.action.label}
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              {request.description}
                            </TableCell>
                            <TableCell align="center">
                              {toDate(request.createdAt)}
                            </TableCell>
                            <TableCell align="center">
                              {renderApprovalStatus(request.approvalStatus.lsc)}
                            </TableCell>
                            <TableCell align="center">
                              {renderApprovalStatus(request.approvalStatus.bm)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
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
        </Box>
      ) : (
        <Typography>Forbidden</Typography>
      )}
    </>
  );
};

export default AnnouncementDetailPage;
