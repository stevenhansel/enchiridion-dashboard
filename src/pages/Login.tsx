import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
import CloseIcon from '@mui/icons-material/Close';

import { AppDispatch } from "../store";
import { login } from "../store/auth";
import { setProfile, ProfileState } from "../store/profile";
import axios, { isAxiosError, ApiErrorResponse } from "../utils/axiosInstance";

import backgroundImage from "../assets/jpg/background-auth.jpeg";
import { RootState } from '../store'

type Props = {
  children?: React.ReactNode;
};

type LoginUser = {
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

const Login = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const userStatusData = useSelector((state: RootState) => state.profile?.userStatus);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  console.log(userStatusData);

  const handleLogin = useCallback(async (values: LoginUser): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post<ProfileState>("/v1/auth/login", {
        email: values.email,
        password: values.password,
      });
      dispatch(
        setProfile({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          role: response.data.role,
          userStatus: response.data.userStatus,
        })
      );
      setIsLoading(false);
      dispatch(login());
    } catch (err: unknown) {
      let message = "Network Error";
      if (
        isAxiosError(err) &&
        "messages" in (err.response?.data as ApiErrorResponse)
      ) {
        message = (err.response?.data as ApiErrorResponse).messages[0];
      }
      setIsLoading(false);
      setErrorMessage(message);
    }
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
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
                  onChange={(event) =>
                    formik.setFieldValue("email", event.target.value)
                  }
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>Password</Typography>
                <TextField
                  id="password"
                  name="password"
                  onChange={(event) =>
                    formik.setFieldValue("password", event.target.value)
                  }
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  variant="standard"
                  type="password"
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
                <Box display="flex" flexDirection="row" sx={{ marginRight: 0.5, marginTop: 1 }}>
                  <Typography sx={{ marginRight: 0.5 }}>
                    Belum punya akun?
                  </Typography>
                  <Link to="/register">Daftar</Link>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ marginTop: 1 }}>
                  <Typography sx={{ marginRight: 0.5 }}>
                    Forgot Password?
                  </Typography>
                  <Link to="/forgot_password">Change</Link>
                </Box>
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
