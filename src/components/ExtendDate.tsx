import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Snackbar,
} from '@mui/material';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useCreateRequestMutation } from '../services/request';
import { ActionCreateRequest } from '../types/store';
import { isApiError, isReduxError, ApiErrorResponse } from '../services/error';

const validationSchema = yup.object({
  extendedEndDate: yup
    .date()
    .min(new Date(), 'extend date cannot be in the past')
    .required('extend date is required'),
  description: yup.string().min(1).required('description is required'),
});

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
};

const ExtendDate = (props: Props) => {
  const [createRequest, { error }] = useCreateRequestMutation();
  const [errorMessage, setErrorMessage] = useState('');
  const { announcementId = '' } = useParams();

  const today = dayjs(props.date);
  const tomorrow = dayjs(props.date).add(1, 'day').toDate();

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: 'extend_date',
      extendedEndDate: dayjs(tomorrow.toDateString()).format('YYYY-MM-DD'),
      announcementId: parseInt(announcementId, 10),
      description: '',
      newDeviceIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        await createRequest(values).unwrap();
        props.setOpen(false);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { messages } = err.data;
          if (messages.length !== 0) {
            setErrorMessage(messages[0]);
          }
        }
      }
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  useEffect(() => {
    if (error && 'data' in error) {
      setErrorMessage((error.data as ApiErrorResponse).messages[0]);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Box sx={{ marginBottom: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                label="Extend Date Announcement"
                inputFormat="MM/dd/yyyy"
                value={dayjs(formik.values.extendedEndDate).format(
                  'YYYY-MM-DD'
                )}
                onChange={newDate =>
                  formik.setFieldValue(
                    'extendedEndDate',
                    dayjs(newDate).format('YYYY-MM-DD')
                  )
                }
                renderInput={params => <TextField {...params} />}
                shouldDisableDate={date => dayjs(date).isSameOrBefore(today)}
              />
            </LocalizationProvider>
          </Box>
          {formik.touched.extendedEndDate && formik.errors.extendedEndDate ? (
            <Typography variant="caption" color={red[700]} fontSize="">
              {String(formik.errors.extendedEndDate)}
            </Typography>
          ) : null}
          <Box>
            <Typography>Description</Typography>
            <TextField
              variant="standard"
              sx={{ width: '100%', marginBottom: 1 }}
              onChange={e => {
                formik.setFieldValue('description', e.target.value);
              }}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Box>
          <Box display="flex">
            <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
              OK
            </Button>
          </Box>
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={() => setErrorMessage('')}
            message={errorMessage}
            action={
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
            }
          />
        </Box>
      </form>
    </>
  );
};

export default ExtendDate;
