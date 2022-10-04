import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, CssBaseline, Typography, CircularProgress } from "@mui/material";

import { AppDispatch } from "../store";
import { setProfile } from "../store/profile";

import { ApiErrorResponse } from "../services/error";
import { authApi } from "../services/auth";
import { RootState } from "../store";

import backgroundImage from "../assets/jpg/background-auth.jpeg";

type Props = {
  children?: React.ReactNode;
};

const VerificationCallbackPage = (_: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();

  const profile = useSelector((state: RootState) => state.profile);

  const handleConfirmEmail = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const response = await dispatch(
      authApi.endpoints.confirmEmail.initiate({
        token: searchParams.get("token"),
      })
    );

    if ("data" in response) {
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
    } else {
      setErrorMessage(
        "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    handleConfirmEmail();
  }, []);

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
                {isLoading ? <CircularProgress color="inherit" /> : null}
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
