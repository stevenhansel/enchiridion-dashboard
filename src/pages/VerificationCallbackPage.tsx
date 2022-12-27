import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  CssBaseline,
  Typography,
  CircularProgress,
  Snackbar,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch } from '../store';
import { setProfile, resetProfile } from '../store/profile';
import { useLazyLogoutQuery, authApi } from '../services/auth';
import { ApiErrorResponse } from '../services/error';
import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Props = {
  children?: React.ReactNode;
};

const VerificationCallbackPage = (_: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const [logout] = useLazyLogoutQuery();

  const [errorMessage, setErrorMessage] = useState('');

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(null).unwrap();
      dispatch(resetProfile());
    } catch (err) {
      // setErrorMessage('Logout failed');
    }
    navigate('/');
  };

  const handleConfirmEmail = useCallback(async (): Promise<void> => {
    const response = await dispatch(
      authApi.endpoints.confirmEmail.initiate({
        token: searchParams.get('token'),
      })
    );

    if ('data' in response) {
      dispatch(
        setProfile({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          role: response.data.role,
          isEmailConfirmed: response.data.isEmailConfirmed,
          userStatus: response.data.userStatus,
        })
      );
      navigate('/waiting-for-approval');
    } else {
      setErrorMessage(
        'data' in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : 'Network Error'
      );
    }
  }, [dispatch]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  useEffect(() => {
    handleConfirmEmail();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'repeat-x',
          height: '100vh',
          width: '100ww',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            bottom: '50%',
            right: '50%',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Button onClick={handleLogout}>back</Button>
            <Box display="flex" justifyContent="center">
              <Typography>Please wait for confirmation</Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <CircularProgress color="inherit" />
            </Box>
            {Boolean(errorMessage) && <Typography>{errorMessage}</Typography>}
          </Box>
        </div>
      </Box>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

export default VerificationCallbackPage;
