import React, { useCallback, useEffect, useState } from "react";
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
import CloseIcon from '@mui/icons-material/Close';

import axios, { isAxiosError, ApiErrorResponse } from '../utils/axiosInstance';

import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Role = {
  id: number;
  name: string;
};

type RegisterForm = {
  name: string,
  email: string,
  password: string,
  reason: string,
  roleId: number | null,
};

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
  roleId: yup.number().required(),
});

const Register = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Record<number, Role>>({});
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = useCallback(async (values: RegisterForm): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.post(
        `/v1/auth/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          roleId: values.roleId,
          registrationReason: values.reason,
        },
      );
      setIsLoading(false);
    } catch (err: unknown) {
      let message = 'Network Error';
      if (isAxiosError(err) && 'messages' in (err.response?.data as ApiErrorResponse)) {
        message = (err.response?.data as ApiErrorResponse).messages[0];
      }
      setErrorMessage(message);
      setIsLoading(false);
    }
  }, []);

  const formik = useFormik<RegisterForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      reason: "",
      roleId: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values: RegisterForm) => {
      handleRegister(values).then(() => {

        navigate(`/register/${values.email}`);
      });
    },
  });

  const handleChange = (e: SelectChangeEvent) => {
    formik.setFieldValue('roleId', parseInt(e.target.value, 10));
  };

  const fetchRoles = useCallback(async (): Promise<Record<number, Role>> => {
    try {
      const { data } = await axios.get(`/v1/roles`);
      const roles: Record<number, Role> = data.contents.reduce((accumulator: any, current: any) => {
        accumulator[current.id] = { id: current.id, name: current.name };
        return accumulator
      }, {});

      return roles;
    } catch (err) {
      throw err;
    }
  }, []);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  useEffect(() => {
    fetchRoles().then((roles: Record<number, Role>) => {
      setRoles(roles);
      setIsReady(true);
    }).catch(() => {
      setErrorMessage('Maintenance');
      setIsReady(true);
    });
  }, [fetchRoles]);

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
          {isReady && Object.keys(roles).length > 0 ? (
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
                <Box sx={{ marginBottom: 5 }}>
                  <Typography>Alasan untuk daftar</Typography>
                  <TextField
                    id="reason"
                    name="reason"
                    variant="standard"
                    onChange={(event) => formik.setFieldValue("reason", event.target.value)}
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
                      value={formik.values.roleId ? formik.values.roleId.toString() : undefined}
                      label="Role"
                      onChange={handleChange}
                      error={
                        formik.touched.roleId && Boolean(formik.errors.roleId)
                      }
                    >
                      {Object.values(roles).map((role: Role) => (
                        <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                      ))}
                    </Select>
                    {formik.touched.roleId && formik.errors.roleId ? (<Typography sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F", }}>Role is required</Typography>) : (null)}
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
                    endIcon={(
                      isLoading && <CircularProgress />
                    )}
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
            onClose={() => setErrorMessage('')}
            message={errorMessage}
            action={(
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          />
        </div>
      </Box>
    </React.Fragment>
  );
};

export default Register;
