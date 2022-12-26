import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Typography,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useCreateRequestMutation } from '../services/request';
import { isApiError, isReduxError, ApiErrorResponse } from '../services/error';
import { ActionCreateRequest } from '../types/store';

const validationSchema = yup.object({
  description: yup.string().required().min(1),
});

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAnnouncementRequest = (props: Props) => {
  const { setOpen } = props;
  const [createRequest, { error }] = useCreateRequestMutation();
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const { announcementId = '' } = useParams();

  const formik = useFormik<ActionCreateRequest>({
    initialValues: {
      action: 'delete',
      extendedEndDate: null,
      announcementId: parseInt(announcementId, 10),
      description: '',
      newDeviceIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        createRequest(values).unwrap();
        setOpen(false);
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
          {deleteConfirmation ? (
            <>
              <Typography sx={{ marginBottom: 1 }}>
                Please state your reason why you want to delete this
                announcement
              </Typography>
              <Box>
                <TextField
                  onChange={e =>
                    formik.setFieldValue('description', e.target.value)
                  }
                  variant="standard"
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  sx={{ width: '100%', marginBottom: 1 }}
                />
              </Box>
              <Button variant="contained" type="submit" sx={{ marginRight: 1 }}>
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(false)}
                sx={{ marginRight: 1 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ marginBottom: 1 }}>
                Are you sure want to delete this announcement?
              </Typography>
              <Button
                variant="contained"
                onClick={() => setDeleteConfirmation(true)}
                sx={{ marginRight: 1 }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(false)}
                sx={{ marginRight: 1 }}
              >
                Cancel
              </Button>
            </>
          )}

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

export default DeleteAnnouncementRequest;
