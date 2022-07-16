import React, { useCallback,  useState } from "react";
import { useParams } from 'react-router-dom';

import {
  Box,
  Button,
  CssBaseline,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import axios, { isAxiosError, ApiErrorResponse } from '../utils/axiosInstance';

import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Props = {
  children?: React.ReactNode;
};

const SendLinkVerificationPage = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPressed, setIsPressed] = useState(false)
  
  const { email } = useParams();

  const handleVerification = useCallback(async (): Promise<void> => {
    try {
      await axios.get(
        `/v1/auth/verification/${email}`,
      );
      setIsPressed(true);
    } catch (err) {
      let message = 'Network Error';
      if (isAxiosError(err) && 'messages' in (err.response?.data as ApiErrorResponse)) {
        message = (err.response?.data as ApiErrorResponse).messages[0];
      }
      setErrorMessage(message);
    }
    
  }, [email]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  const action = (
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
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat-x",
          height: "100vh",
          width: "100ww",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            bottom: "50%",
            right: "50%",
          }}
        >
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={() => setErrorMessage('')}
            message={errorMessage}
            action={action}
          />
          <Box
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box display="flex" justifyContent="center" >
              <Button onClick={handleVerification} disabled={isPressed} variant="contained">Kirim Link Verifikasi</Button>
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default SendLinkVerificationPage;