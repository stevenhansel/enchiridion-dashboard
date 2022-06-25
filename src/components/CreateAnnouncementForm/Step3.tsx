import React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

import { CreateAnnouncementFormValues } from './form';

const Step3 = () => {
  const { values } = useFormikContext<CreateAnnouncementFormValues>();

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
            bgcolor: 'white',
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
            Lantai {'&'} Device
          </Typography>
          <Typography>
            {values.devices.map(({ deviceId, floorName, deviceName }) => (
              <Typography key={deviceId} style={{ marginBottom: '6px' }}>
                {floorName}, {deviceName}
              </Typography>
            ))}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained">Next</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3;
