import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
  CssBaseline,
  Snackbar,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { authApi } from '../services/auth';
import { isApiError, isReduxError } from '../services/error';

import { AppDispatch } from '../store';

import backgroundImage from '../assets/jpg/background-auth.jpeg';

const SEND_VERIFICATION_RETRY_DELAY_SECONDS = 20;

type Props = {
  children?: React.ReactNode;
};

const SendLinkVerificationPage = (_: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(
    SEND_VERIFICATION_RETRY_DELAY_SECONDS
  );

  const dispatch: AppDispatch = useDispatch();
  const { email } = useParams();

  const handleVerification = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setIsPressed(true);
    try {
      await dispatch(
        authApi.endpoints.emailVerification.initiate({ email })
      ).unwrap();
    } catch (err) {
      if (isReduxError(err) && isApiError(err.data)) {
        const { errorCode, messages } = err.data;
        const [message] = messages;
        if (errorCode === 'USER_NOT_FOUND') {
          setErrorMessage(message);
        } else if (errorCode === 'USER_ALREADY_VERIFIED') {
          setErrorMessage(message);
        }
      }
    }
    setIsLoading(false);
  }, [email]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  useEffect(() => {
    if (!isPressed) {
      return;
    }
    const interval = setInterval(() => {
      setCountdownSeconds((prevCount: number) => {
        if (prevCount === 0) {
          clearInterval(interval);
          setIsPressed(false);
          return prevCount;
        }
        return prevCount - 1;
      });

      return () => clearInterval(interval);
    }, 1000);
  }, [isPressed]);

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
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box display="flex" justifyContent="center">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    onClick={handleVerification}
                    disabled={isPressed}
                    variant="contained"
                  >
                    Kirim Link Verifikasi
                  </Button>
                  {isPressed ? (
                    <Typography>
                      {new Date(countdownSeconds * 1000)
                        .toISOString()
                        .substring(14, 19)}
                    </Typography>
                  ) : null}
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default SendLinkVerificationPage;
