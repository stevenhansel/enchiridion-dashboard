import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';

import {
  Box,
  Button,
  CssBaseline,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import axios from '../utils/axiosInstance';

type SearchParams = {
  token: string
};

type Props = {
  children?: React.ReactNode;
};

const VerificationCallbackPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('test');
  
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('token'));
  
  const handleConfirmEmail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.put(
        '/v1/auth/verification',
        {
          token: searchParams.get('token'),
        }
      );
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('error bang');
    }
  }, [searchParams]);

  useEffect(() => {
    handleConfirmEmail();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage:
            "url('https://www.superherohype.com/assets/uploads/2020/08/The-Boys-Season-2-Trailer-1280x720.png')",
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
            <Box display="flex" justifyContent="center" flexDirection="row">
                <Typography>Please wait for confirmation</Typography>
            {isLoading ? (<CircularProgress color="inherit" />) : (null)}
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default VerificationCallbackPage;