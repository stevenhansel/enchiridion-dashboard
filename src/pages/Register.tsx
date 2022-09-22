import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  IconButton,
  Snackbar,
  CircularProgress,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";

import { useRegisterMutation } from "../services/auth";
import { useLazyGetRolesQuery } from "../services/roles";

import { RegisterForm } from "../types/store";

import backgroundImage from "../assets/jpg/background-auth.jpeg";
import { isApiError, isReduxError } from "../services/error";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name should be of minimum 4 characters length")
    .required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  role: yup.string().required(),
});

const Register = () => {
  const navigate = useNavigate();

  const [getRoles, { data, isLoading }] = useLazyGetRolesQuery();

  const [errorMessage, setErrorMessage] = useState("");

  const [register] = useRegisterMutation();

  const formik = useFormik<RegisterForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      reason: "",
      role: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await register(values).unwrap();
        navigate(`/register/${values.email}`);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          console.log(err.data);
          const { errorCode, messages } = err.data;
          const [message] = messages;

          if (errorCode === "EMAIL_ALREADY_EXISTS") {
            setFieldError("email", message);
          } else if (errorCode === "ROLE_NOT_FOUND") {
            setFieldError("role", message);
          }
        }
      }
    },
  });

  const handleChange = (e: SelectChangeEvent) => {};

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    getRoles(null);
  }, [getRoles]);

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
          {data && data.length > 0 ? (
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
                  Register
                </Typography>
                <Box sx={{ marginBottom: 3 }}>
                  <Typography>Name</Typography>
                  <TextField
                    autoComplete="off"
                    id="name"
                    name="name"
                    onChange={(e) => {
                      formik.setFieldValue("name", e.target.value);
                    }}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="standard"
                    fullWidth
                  />
                </Box>
                <Box sx={{ marginBottom: 3 }}>
                  <Typography>Email</Typography>
                  <TextField
                    autoComplete="off"
                    id="email"
                    name="email"
                    onChange={(e) =>
                      formik.setFieldValue("email", e.target.value)
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
                    autoComplete="off"
                    id="password"
                    name="password"
                    onChange={(e) =>
                      formik.setFieldValue("password", e.target.value)
                    }
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    variant="standard"
                    type="password"
                    fullWidth
                  />
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography>Registration Reason</Typography>
                  <TextField
                    autoComplete="off"
                    id="reason"
                    name="reason"
                    variant="standard"
                    onChange={(e) =>
                      formik.setFieldValue("reason", e.target.value)
                    }
                    error={
                      formik.touched.reason && Boolean(formik.errors.reason)
                    }
                    helperText={formik.touched.reason && formik.errors.reason}
                    fullWidth
                  />
                </Box>
                <Box>
                  <FormControl fullWidth sx={{ marginBottom: 5 }}>
                    <InputLabel id="role">Role</InputLabel>
                    <Select
                      labelId="role"
                      id="role"
                      label="Role"
                      value={
                        formik.values.role !== null ? formik.values.role : ""
                      }
                      defaultValue=""
                      onChange={(e) => {
                        formik.setFieldValue("role", e.target.value);
                      }}
                      error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                      {data.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.role && formik.errors.role ? (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          marginTop: "3px",
                          marginRight: "14px",
                          color: "#D32F2F",
                        }}
                      >
                        Role is required
                      </Typography>
                    ) : null}
                  </FormControl>
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
                    Daftar
                  </Button>
                  <Box display="flex" flexDirection="row"></Box>
                </Box>
              </Box>
            </form>
          ) : (
            <>
              <CircularProgress />
            </>
          )}
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
        </div>
      </Box>
    </React.Fragment>
  );
};

export default Register;
