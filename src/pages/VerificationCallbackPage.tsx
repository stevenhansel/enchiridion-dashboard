import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import {
  Box,
  CssBaseline,
  Typography,
  CircularProgress,
} from "@mui/material";

import { AppDispatch } from '../store';
import { setProfile, ProfileState } from '../store/profile';
import { login } from '../store/auth';

import axios, { isAxiosError, ApiErrorResponse } from '../utils/axiosInstance';

import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Props = {
  children?: React.ReactNode;
};

const VerificationCallbackPage = (_: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [searchParams] = useSearchParams();
  
  const handleConfirmEmail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await axios.put<ProfileState>(
        '/v1/auth/verification',
        {
          token: searchParams.get('token'),
        }
      );
      dispatch(setProfile({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        profilePicture: response.data.profilePicture,
        role: response.data.role,
        userStatus: response.data.userStatus,
      }));
      dispatch(login());
      setIsLoading(false);
    } catch (err: unknown) {
      let message = 'Network Error';
      if (isAxiosError(err) && 'messages' in (err.response?.data as ApiErrorResponse)) {
        message = (err.response?.data as ApiErrorResponse).messages[0];
      }
      setIsLoading(false);
      setErrorMessage(message);
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    handleConfirmEmail();
  }, [handleConfirmEmail]);

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
          <Box
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box display="flex" justifyContent="center" flexDirection="column">
                <Typography>Please wait for confirmation</Typography>
                <Box display="flex" justifyContent="center">
                {isLoading ? (<CircularProgress color="inherit" />) : (null)}
                </Box>
            {Boolean(errorMessage) && <Typography>{errorMessage}</Typography>}
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default VerificationCallbackPage;