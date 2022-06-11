import React, { useEffect, useState } from 'react';
import { Formik, FormikHelpers } from 'formik';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import axios from '../axios';

interface FormValues {
  title: string;
  media: File | null;
  duration: number;
  notes: string;
  deviceIds: number[];
}

type Device = {
  id: number;
  machineId: string;
};

type Props = {
  onSave: () => Promise<void>;
};

const initialValues: FormValues = {
  title: '',
  media: null,
  duration: 0,
  notes: '',
  deviceIds: [],
};

const CreateAnnouncementForm = ({ onSave }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) fetchDevices();
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);

  const handleClose = (resetForm: () => void) => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const formData = new FormData();
    // Object.entries(values).forEach(([key, value]) => {
    //   if (key === 'deviceIds') {
    //     formData.append(key, value.map())
    //   }
    //   formData.append(key, value);
    // });

    formData.append('title', values.title);
    if (values.media) {
      formData.append('media', values.media);
    }
    formData.append('duration', String(values.duration));
    formData.append('notes', values.notes);
    formData.append('deviceIds', values.deviceIds.join(','));

    axios
      .post('/v1/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => onSave())
      .then(() => handleClose(resetForm));
  };

  const fetchDevices = async () => {
    try {
      if (!isLoading) setIsLoading(true);

      const response = await axios.get('/v1/devices');
      const devices = response.data.contents.map((device: any) => ({
        id: device.id,
        machineId: device.machineId,
      }));

      setDevices(devices);
      setIsLoading(false);
    } catch (err) {}
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ handleSubmit, setFieldValue, resetForm, values }) => (
        <>
          <Button onClick={handleOpen}>Create Announcement</Button>

          <Dialog open={isOpen} onClose={handleClose}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Title"
                      fullWidth
                      variant="standard"
                      value={values.title}
                      onChange={(e) => setFieldValue('title', e.target.value)}
                    />

                    <TextField
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      margin="dense"
                      id="name"
                      label="Duration"
                      fullWidth
                      variant="standard"
                      value={values.duration}
                      onChange={(e) =>
                        setFieldValue('duration', +e.target.value)
                      }
                    />

                    <TextField
                      margin="dense"
                      id="name"
                      label="Notes"
                      fullWidth
                      variant="standard"
                      value={values.notes}
                      onChange={(e) => setFieldValue('notes', e.target.value)}
                    />

                    <div>
                      {devices
                        ? devices.map((device) => (
                            <Box
                              key={device.id}
                              style={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'center',
                              }}
                            >
                              <Checkbox
                                checked={
                                  values.deviceIds.findIndex(
                                    (id) => id === device.id
                                  ) !== -1
                                }
                                onChange={(e) => {
                                  let deviceIds: number[];

                                  if (e.target.checked) {
                                    deviceIds = values.deviceIds.concat(
                                      device.id
                                    );
                                  } else {
                                    deviceIds = values.deviceIds.filter(
                                      (id) => id !== device.id
                                    );
                                  }

                                  setFieldValue('deviceIds', deviceIds);
                                }}
                              />

                              <Typography>
                                {device.id} - {device.machineId}
                              </Typography>
                            </Box>
                          ))
                        : null}
                    </div>

                    <Button variant="contained" component="label">
                      Upload File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          if (!e.currentTarget.files) return;

                          const file = e.currentTarget.files[0];
                          setFieldValue('media', file);
                        }}
                      />
                    </Button>

                    <Typography>
                      Selected File:{' '}
                      {values.media ? `${values.media.name}` : ''}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleClose(resetForm)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSubmit()}>Create</Button>
                  </DialogActions>
                </Box>
              )}
            </Box>
          </Dialog>
        </>
      )}
    </Formik>
  );
};

export default CreateAnnouncementForm;
