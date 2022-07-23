import React, { useCallback, useContext } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useFormikContext } from "formik";

import { CreateAnnouncementFormValues } from "./form";
import { CreateAnnouncementFormContext } from "./context";

const Step3 = () => {
  const { values } = useFormikContext<CreateAnnouncementFormValues>();
  const { handlePrevStep } = useContext(CreateAnnouncementFormContext);

  const handlePrevSubmission = useCallback(() => {
    handlePrevStep();
  }, [handlePrevStep]);

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
            bgcolor: "white",
            boxShadow: 1,
            borderRadius: 1,
            p: 2,
          }}
        >
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Title Announcement
            </Typography>
            <Typography>{values.title}</Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              File Announcement
            </Typography>
            <Typography>
              {values.media ? values.media.file.name : null}
            </Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Durasi Hari Announcement
            </Typography>
            <Typography>{values.duration} Hari</Typography>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography display="flex" fontWeight="bold">
              Notes
            </Typography>
            <Typography>Ingin di paling depan</Typography>
          </Box>
          <Typography display="flex" fontWeight="bold">
            Lantai {"&"} Device
          </Typography>
          <Box>
            {values.devices.map(({ deviceId, floorName, deviceName }) => (
              <Typography key={deviceId} style={{ marginBottom: "6px" }}>
                {floorName}, {deviceName}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{marginTop: 1}}>
          <Button variant="contained" sx={{marginRight: 1}} onClick={handlePrevSubmission}>
            Previous
          </Button>
          <Button variant="contained">Submit</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3;
