import React, { useCallback, useContext, useEffect } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useFormikContext } from "formik";

import { CreateAnnouncementFormValues } from "./form";
import { CreateAnnouncementFormContext } from "./context";

import { useGetBuildingsQuery } from "../../services/building";
import { useLazyGetFloorsQuery } from "../../services/floor";

import { BuildingFloorDevices } from "../../types/store";

const Step3 = () => {
  const { data: buildingHash } = useGetBuildingsQuery(null);
  const [getFloors, { data: floorsData, isLoading: isFloorLoading, error: floorError }] = useLazyGetFloorsQuery();

  useEffect(() => {
    getFloors(null);
  }, []);

  const { values, handleSubmit } =
    useFormikContext<CreateAnnouncementFormValues>();
  const { handlePrevStep } = useContext(CreateAnnouncementFormContext);

  const handlePrevSubmission = useCallback(() => {
    handlePrevStep();
  }, [handlePrevStep]);

  const buildingFloorDevices: Record<string, BuildingFloorDevices>  = buildingHash ? Object.values(buildingHash).reduce((prev, curr) => {
    const filteredFloors = floorsData?.contents
      .map((floor) => ({
        ...floor,
        devices: floor.devices.filter((device) => values.devices.includes(device.id.toString())),
      }))
      .filter((floor) => (curr.id === floor.building.id && floor.devices.length > 0));

    return {
      ...prev,
      [curr.id]: {
        name: curr.name,
        floors: filteredFloors,
      },
    }
  }, {}) : {};

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          sx={{
            marginTop: 5,
            p: 2,
          }}
        >
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h2" align="center">
              {values.title}
            </Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            {values.media ? (
              <img
                alt="banner"
                src={values.media.image.src}
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
              <Typography>Start Date</Typography>
              <Typography>
                {new Date(values.startDate).toDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography>End Date</Typography>
              <Typography>{new Date(values.endDate).toDateString()}</Typography>
            </Box>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Notes
            </Typography>
            <Typography>{values.notes}</Typography>
          </Box>
          <Typography display="flex" fontWeight="bold">
            Device
          </Typography>
          <Box>
            {Object.entries(buildingFloorDevices).map(([buildingId, building]) => (
              <React.Fragment key={buildingId}>
                {building.floors.length > 0 ? (
                  <Box>
                    <Typography>
                      {`• ${building.name}`}
                    </Typography>
                    <Box>
                      {building.floors.map((floor) => (
                        <Box
                          key={`building-${buildingId}-floor-${floor.id}`}
                          pl={2}
                        >
                          <Typography>
                            {`• ${floor.name}`}
                          </Typography>
                          <Box>
                            {floor.devices.map((device) => (
                              <Box
                                key={`building-${buildingId}-floor-${floor.id}-device-${device.id}`}
                                pl={2}
                              >
                                <Typography>
                                  {`• ${device.name}`}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : null}
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: 1 }}
        >
          <Button
            variant="contained"
            sx={{ marginRight: 1 }}
            onClick={handlePrevSubmission}
          >
            Previous
          </Button>
          <Button variant="contained" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3;
