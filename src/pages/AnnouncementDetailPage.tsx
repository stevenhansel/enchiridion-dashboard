import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { useGetAnnouncementDetailQuery } from "../services/announcement";
import { useGetBuildingsQuery } from "../services/building";
import { useLazyGetFloorsQuery } from "../services/floor";
import Layout from "../components/Layout";

const toDate = (dateStr: string) => dayjs(dateStr).format("DD MMM YYYY");

const AnnouncementDetailPage = () => {
  const { announcementId = "" } = useParams();

  const { data: buildings, isLoading: isBuildingLoading } =
    useGetBuildingsQuery(null);
  const [getFloors, { data: floorsData, isLoading: isGetFloorsLoading }] =
    useLazyGetFloorsQuery();
  const { data: announcements, isLoading: isGetAnnouncementDetailLoading } =
    useGetAnnouncementDetailQuery(
      { announcementId },
      {
        skip: announcementId === "",
      }
    );

  const [currentBuildingId, setCurrentBuildingId] = useState<string>("");

  const isLoading =
    isBuildingLoading || isGetFloorsLoading || isGetAnnouncementDetailLoading;

  // useEffect(() => {
  //   // TODO: Make mechanism that ensures initial current building id has device(s) in the announcement hash
  //   if (buildings && Object.keys(buildings).length > 0) {
  //     setCurrentBuildingId(Object.keys(buildings)[1]);
  //   }
  // }, [buildings]);

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
    getFloors(null);
  }, []);

  return (
    <Layout>
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
              <Box sx={{ marginBottom: 2 }}>
                {announcements?.media ? (
                  <img
                    alt="banner"
                    src={announcements.media}
                    style={{ width: "100%" }}
                  />
                ) : null}
              </Box>
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
                      {floorsData?.contents
                        .filter(
                          (floor) =>
                            currentBuildingId === floor.building.id.toString()
                        )
                        .map((floor) => (
                          <Box key={floor.id} display="flex">
                            <Box
                              sx={{
                                minWidth: 100,
                                flex: 1,
                                marginRight: 1,
                                marginBottom: 2,
                              }}
                            >
                              {floor.name}
                            </Box>
                            <Box display="flex" flexWrap="wrap">
                              {floor.devices.map((device) => (
                                <Button
                                  key={device.id}
                                  onClick={() => {}}
                                  //variant={values.devices.includes(device.id.toString()) ? 'contained' : 'text'}
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
                                    marginRight: 1,
                                    marginBottom: 1,
                                    width: 140,
                                  }}
                                >
                                  {device.name}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default AnnouncementDetailPage;
