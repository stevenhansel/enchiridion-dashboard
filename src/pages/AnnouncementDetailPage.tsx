import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";


import { useGetAnnouncementDetailQuery } from "../services/announcement";
import { useGetBuildingsQuery } from "../services/building";
import { useGetFloorsQuery } from "../services/floor";

const toDate = (dateStr: string) => dayjs(dateStr).format('DD MMM YYYY');

const AnnouncementDetailPage = () => {
  const { announcementId = '' } = useParams();

  const {
    data: buildingHash,
    isLoading: isGetBuildingsLoading,
  } = useGetBuildingsQuery(null);
  const {
    data: floorHash,
    isLoading: isGetFloorsLoading,
  } = useGetFloorsQuery(null);
  const {
    data: announcementHash,
    isLoading: isGetAnnouncementDetailLoading,
  } = useGetAnnouncementDetailQuery({ announcementId }, {
    skip: announcementId === '',
  });

  const [currentBuildingId, setCurrentBuildingId] = useState<string>('');

  const isLoading = isGetBuildingsLoading || isGetFloorsLoading || isGetAnnouncementDetailLoading;

  const floors = floorHash ? Object.values(floorHash) : [];
  const buildings = buildingHash ? Object.values(buildingHash) : [];

  useEffect(() => {
    // TODO: Make mechanism that ensures initial current building id has device(s) in the announcement hash
    if (buildingHash && Object.keys(buildingHash).length > 0) {
      setCurrentBuildingId(Object.keys(buildingHash)[0]);
    }
  }, [buildingHash]);

  return (
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
              <Typography variant="h2" align="center">{announcementHash?.title}</Typography>
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              {announcementHash?.media ? (
                <img
                  alt="banner"
                  src={announcementHash.media}
                  style={{ width: '100%' }}
                />
              ) : null}
            </Box>
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography>Start Date</Typography>
                <Typography>{toDate(announcementHash!.startDate)}</Typography>
              </Box>
              <Box>
                <Typography>End Date</Typography>
                <Typography>{toDate(announcementHash!.endDate)}</Typography>
              </Box>
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              <Typography display="flex" fontWeight="bold">
                Notes
              </Typography>
              <Typography>{announcementHash!.notes}</Typography>
            </Box>
            <Typography display="flex" fontWeight="bold">
              Device
            </Typography>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  border: '1px solid #c4c4c4',
                }}
              >
                <Box
                  sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {buildings.map((building) => (
                    <Button
                      key={building.id}
                      onClick={() => setCurrentBuildingId(building.id.toString())}
                      variant={currentBuildingId === building.id.toString() ? 'contained' : 'text'}
                      color={currentBuildingId === building.id.toString() ? 'secondary' : 'inactive'}
                      sx={{ marginBottom: 1 }}
                    >
                      {building.name}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ borderLeft: '1px solid #c4c4c4' }} />
                <Box
                  sx={{
                    padding: 3,
                    flex: 1,
                  }}
                >
                  <Box>
                    {floors.filter((floor) => currentBuildingId === floor.building.id.toString()).map((floor) => (
                      <Box
                        key={floor.id}
                        display="flex"
                      >
                        <Box sx={{ minWidth: 100, flex: 1, marginRight: 1, marginBottom: 2 }}>
                          {floor.name}
                        </Box>
                        <Box display="flex" flexWrap="wrap">
                          {floor.devices.map((device) => (
                            <Button
                              key={device.id}
                              onClick={() => {}}
                              //variant={values.devices.includes(device.id.toString()) ? 'contained' : 'text'}
                              variant="contained"
                              color={announcementHash!.devices.map((announcementDevice) => announcementDevice.id).includes(device.id) ? 'secondary' : 'inactive'}
                              sx={{ marginRight: 1, marginBottom: 1, width: 140 }}
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
  );
};

export default AnnouncementDetailPage;
