import React, { useCallback, useEffect, useContext, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import { red } from '@mui/material/colors';
import { useLazyGetFloorsQuery } from '../../services/floor';
import { CreateAnnouncementFormContext } from './context';
import { CreateAnnouncementFormValues } from './form';
import { validateFormikFields } from './util';

const fields = ['devices'];

const Step3 = () => {
  const navigate = useNavigate();
  const [getFloors, { data: floors }] = useLazyGetFloorsQuery();

  const formik = useFormikContext<CreateAnnouncementFormValues>();
  const { errors, touched, validateField, setFieldValue, values } = formik;
  const { handleNextStep, handlePrevStep } = useContext(
    CreateAnnouncementFormContext
  );

  const [updatedActiveAnnouncements, _] = useState<number[]>([]);

  const floorCheck =
    floors &&
    floors?.contents.filter(
      floor => values.buildingId === floor.building.id.toString()
    );

  const deviceCheck =
    floors &&
    floors.contents
      .filter(floor => values.buildingId === floor.building.id.toString())
      .map(floor => floor.devices.length);

  const deviceState = deviceCheck?.every((d: number) => {
    return d === 0;
  });

  const checkActiveAnnouncements = (activeAnnouncements: number) => {
    return activeAnnouncements < 10;
  };

  const handleSelectDevice = useCallback(
    (selectedDeviceId: number, selectedActiveAnnouncement: number) => {
      const selectedDeviceIndex = values.devices.findIndex(
        deviceId => deviceId === selectedDeviceId
      );

      let updatedDevices = cloneDeep(values.devices);

      if (selectedDeviceIndex !== -1) {
        updatedDevices.splice(selectedDeviceIndex, 1);
        updatedActiveAnnouncements.splice(selectedDeviceIndex, 1);
      } else {
        updatedDevices.push(selectedDeviceId);
        updatedActiveAnnouncements.push(selectedActiveAnnouncement);
      }
      setFieldValue('devices', updatedDevices);
    },
    [values, setFieldValue]
  );

  const handleNextSubmission = useCallback(() => {
    const errors = validateFormikFields(formik, fields);
    if (
      errors.length > 0 ||
      !updatedActiveAnnouncements.every(checkActiveAnnouncements)
    )
      return;

    handleNextStep();
  }, [formik, handleNextStep]);

  const handlePrevSubmission = useCallback(() => {
    handlePrevStep();
  }, [handlePrevStep]);

  useEffect(() => {
    fields.forEach(field => validateField(field));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getFloors(null);
  }, []);

  console.log(floors);

  return (
    <Box width="100%">
      {floorCheck?.length === 0 ? (
        <>
          <Box display="flex" justifyContent="center">
            <Typography>
              {values.buildingName} does not have floor and device yet! Please
              make the floor and then proceed to device page by clicking this
              button below!
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button onClick={() => navigate('/floor')} variant="contained">
              Floor Page
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6">
            Building you Chose: {values.buildingName}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              border: '1px solid #c4c4c4',
            }}
          >
            <Box
              sx={{
                padding: 3,
              }}
            >
              <Box>
                <>
                  {floors &&
                    floors?.contents
                      .filter(
                        floor =>
                          values.buildingId === floor.building.id.toString()
                      )
                      .map(floor => (
                        <Box
                          key={floor.id}
                          display="flex"
                          sx={{
                            border: '1px solid #c4c4c4',
                            marginBottom: 1,
                          }}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              minWidth: 100,
                              marginRight: 1,
                              marginBottom: 2,
                              margin: 1,
                            }}
                          >
                            {floor.name}
                          </Box>
                          <Box sx={{ width: '100%' }}>
                            {floor.devices.map(device => (
                              <Tooltip
                                key={device.id}
                                title={
                                  device.totalAnnouncements >= 10 ? (
                                    <>
                                      <>
                                        Announcement on this device already
                                        reached limit
                                      </>
                                      <br></br>
                                      <Box
                                        display="flex"
                                        justifyContent="center"
                                      >
                                        Device Location: {device.description}
                                      </Box>
                                    </>
                                  ) : (
                                    `Device Location: ${device.description}`
                                  )
                                }
                              >
                                {device.totalAnnouncements >= 10 ? (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                      handleSelectDevice(
                                        device.id,
                                        device.totalAnnouncements
                                      )
                                    }
                                    sx={{ margin: 1, width: 140 }}
                                  >
                                    {device.name}
                                  </Button>
                                ) : (
                                  <Button
                                    key={device.id}
                                    onClick={() =>
                                      handleSelectDevice(
                                        device.id,
                                        device.totalAnnouncements
                                      )
                                    }
                                    variant={
                                      values.devices.includes(device.id)
                                        ? 'contained'
                                        : 'outlined'
                                    }
                                    color={
                                      values.devices.includes(device.id)
                                        ? 'secondary'
                                        : 'inactive'
                                    }
                                    disabled={
                                      device.totalAnnouncements === 10
                                        ? true
                                        : false
                                    }
                                    sx={{ margin: 1, width: 140 }}
                                  >
                                    {device.name}
                                  </Button>
                                )}
                              </Tooltip>
                            ))}
                          </Box>
                        </Box>
                      ))}
                </>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {touched.devices &&
            errors.devices &&
            typeof errors.devices === 'string' ? (
              <Typography
                variant="caption"
                color={red[700]}
                sx={{ marginTop: 1 }}
              >
                {errors.devices}
              </Typography>
            ) : null}

            {!updatedActiveAnnouncements.every(checkActiveAnnouncements) ? (
              <Typography
                variant="caption"
                color={red[700]}
                sx={{ marginTop: 1 }}
              >
                One of the device you chose the announcements already reached
                limit
              </Typography>
            ) : null}
          </Box>
          {deviceState ? (
            <>
              <Box
                display="flex"
                justifyContent="center"
                sx={{ marginBottom: 1 }}
              >
                <Typography variant="h6">
                  Building you chose does not have a device yet! Please create
                  one by device page or by clicking this button below
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Button variant="contained" onClick={() => navigate('/device')}>
                  Device Page
                </Button>
              </Box>
            </>
          ) : null}
        </>
      )}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 5 }}
      >
        <Button
          variant="contained"
          onClick={handlePrevSubmission}
          sx={{ marginRight: 1 }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNextSubmission}
          disabled={deviceState ? true : false}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
