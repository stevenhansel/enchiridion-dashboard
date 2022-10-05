import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Box,
  Snackbar,
  CircularProgress,
  Button,
  Typography,
  CssBaseline,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { AppDispatch } from "../store";
import { setProfile } from "../store/profile";

import { ApiErrorResponse, isReduxError, isApiError } from "../services/error";
import { authApi } from "../services/auth";

import backgroundImage from "../assets/jpg/background-auth.jpeg";

type LoginForm = {
  email: string;
  password: string;
};

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = useCallback(
    async (values: LoginForm): Promise<void> => {
      setIsLoading(true);

      const response = await dispatch(
        authApi.endpoints.login.initiate({
          email: values.email,
          password: values.password,
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
            userStatus: response.data.userStatus,
            isEmailConfirmed: response.data.isEmailConfirmed,
          })
        );
      } else if (
        isReduxError(response.error) &&
        isApiError(response.error.data)
      ) {
        const { errorCode } = response.error.data;
        if (errorCode === "FORBIDDEN_PERMISSION") {
          setErrorMessage(
            "data" in response.error
              ? (response.error.data as ApiErrorResponse).messages[0]
              : "Network Error"
          );
          navigate("/waiting-for-approval");
        } else if (errorCode === "AUTHENTICATION_FAILED") {
          setErrorMessage(
            "data" in response.error
              ? (response.error.data as ApiErrorResponse).messages[0]
              : "Network Error"
          );
        }
      }
      setIsLoading(false);
    },
    [dispatch]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleLogin,
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

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
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                bgcolor: "white",
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
                minWidth: 300,
              }}
            >
              <Typography
                variant="h4"
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                Login
              </Typography>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>Email</Typography>
                <TextField
                  id="email"
                  name="email"
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value)
                  }
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="standard"
                  fullWidth
                  autoComplete="off"
                />
              </Box>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>Password</Typography>
                <TextField
                  id="password"
                  name="password"
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  variant="standard"
                  type="password"
                  autoComplete="off"
                  fullWidth
                />
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Button
                  variant="contained"
                  disabled={isLoading}
                  type="submit"
                  sx={{ marginBottom: 0.5 }}
                  endIcon={isLoading && <CircularProgress />}
                >
                  Masuk
                </Button>
                <Box
                  display="flex"
                  flexDirection="row"
                  sx={{ marginRight: 0.5, marginTop: 1 }}
                >
                  <Typography sx={{ marginRight: 0.5 }}>
                    Belum punya akun?
                  </Typography>
                  <Link to="/register">Daftar</Link>
                </Box>
                {/* <Box display="flex" flexDirection="row" sx={{ marginTop: 1 }}>
                  <Typography sx={{ marginRight: 0.5 }}>
                    Forgot Password?
                  </Typography>
                  <Link to="/forgot-password">Change</Link>
                </Box> */}
              </Box>
            </Box>
            <Snackbar
              open={Boolean(errorMessage)}
              autoHideDuration={6000}
              onClose={() => setErrorMessage("")}
              message={errorMessage}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
          </form>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default Login;
