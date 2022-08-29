import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

import { AppDispatch, RootState } from "../store";

import { useRegisterMutation } from "../services/auth";
import { useLazyGetRolesQuery, rolesApi } from "../services/roles";

import { RegisterForm } from "../types/store";

import backgroundImage from "../assets/jpg/background-auth.jpeg";

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
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const rolesState = useSelector((state: RootState) => state.roles);
  
  const [getRoles, { data, isLoading, error }] = useLazyGetRolesQuery();

  const [isReady, setIsReady] = useState(false);
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
    onSubmit: (values) => {
      register(values);
    },
  });

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue("role", e.target.value as string);
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  useEffect(() => {
    getRoles(null);
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
                  <Typography>Nama</Typography>
                  <TextField
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="standard"
                    fullWidth
                  />
                </Box>
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
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    variant="standard"
                    type="password"
                    fullWidth
                  />
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography>Alasan untuk daftar</Typography>
                  <TextField
                    id="reason"
                    name="reason"
                    variant="standard"
                    onChange={(event) =>
                      formik.setFieldValue("reason", event.target.value)
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
                    <InputLabel
                      id="role"
                    >
                      Role
                    </InputLabel>
                    <Select
                      labelId="role"
                      id="role"
                      label="Role"
                      value={formik.values.role !== null ? formik.values.role : ""}
                      defaultValue=""
                      onChange={handleChange}
                      error={
                        formik.touched.role && Boolean(formik.errors.role)
                      }
                    >
                      {data.map((role) => (
                        <MenuItem key={role.value} value={role.value}>{role.name}</MenuItem>
                      ))}
                    </Select>
                    {formik.touched.role && formik.errors.role ? (<Typography sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F", }}>Role is required</Typography>) : (null)}
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
            <div>
              <CircularProgress />
            </div>
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
