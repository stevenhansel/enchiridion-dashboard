import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from '@mui/material';
import { West as WestIcon, Close as CloseIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { useChangePasswordMutation } from '../services/auth';
import { isApiError, isReduxError } from '../services/error';

type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};

const validationSchema = yup.object({
  oldPassword: yup.string().required('Please enter your old Password'),
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('New Password is required'),
});

const UserProfilePage = () => {
  const navigate = useNavigate();

  const profile = useSelector((state: RootState) => state.profile);

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [changePassword] = useChangePasswordMutation();

  const handleLogout = () => {
    navigate('/announcement');
  };

  const formik = useFormik<ChangePassword>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await changePassword(values).unwrap();
        setOpen(false);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;
          if (errorCode === 'USER_INVALID_OLD_PASSWORD') {
            setFieldError('oldPassword', message);
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

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          bgcolor: 'lightblue',
          boxShadow: 1,
          borderRadius: 1,
          p: 2,
          width: '100%',
        }}
      >
        <Box>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleLogout}
            color="inherit"
          >
            <WestIcon />
          </IconButton>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h5" fontWeight="bold">
            Profile
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Typography
          display="flex"
          justifyContent="center"
          alignItems="center"
          variant="h5"
        >
          {profile?.name}
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ marginTop: 3 }}
      >
        <Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID
            </Typography>
            <Typography>{profile?.id}</Typography>
          </Box>

          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography>{profile?.email}</Typography>
          </Box>
        </Box>
        <Box sx={{ marginLeft: 40 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              Posisi
            </Typography>
            <Typography>{profile?.role.name}</Typography>
          </Box>

          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Description</Typography>
            <Typography>{profile?.role.description}</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ marginRight: 1 }}
        >
          Ganti Password
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Typography>Old Password</Typography>
              <TextField
                variant="standard"
                id="Old Password"
                type="password"
                sx={{ width: '100%' }}
                onChange={e =>
                  formik.setFieldValue('oldPassword', e.target.value)
                }
                error={
                  formik.touched.oldPassword &&
                  Boolean(formik.errors.oldPassword)
                }
                helperText={
                  formik.touched.oldPassword && formik.errors.oldPassword
                }
              />
              <Typography sx={{ marginTop: 1 }}>New Password</Typography>
              <TextField
                variant="standard"
                id="New Password"
                type="password"
                sx={{ width: '100%' }}
                onChange={e =>
                  formik.setFieldValue('newPassword', e.target.value)
                }
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />
              <Box display="flex" sx={{ marginTop: 1 }}>
                <Button
                  sx={{ marginRight: 1 }}
                  variant="contained"
                  type="submit"
                >
                  Change
                </Button>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
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
    </>
  );
};

export default UserProfilePage;
