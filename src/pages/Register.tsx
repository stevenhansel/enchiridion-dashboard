import React, { useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

import {
  Box,
  Autocomplete,
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
import CloseIcon from "@mui/icons-material/Close";

import { UserFilterOption } from "../types/store";

import { useRegisterMutation } from "../services/auth";
import { useLazyGetRolesQuery } from "../services/roles";
import { useLazyGetBuildingsQuery } from "../services/building";

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
  buildingId: yup.string().required("Building domain is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [nextStep, setNextStep] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState<UserFilterOption | null>(
    null
  );

  const [isBuildingFilterLoading, setIsBuildingFilterLoading] = useState(false);
  const [buildingFilterOptions, setBuildingFilterOptions] = useState<
    UserFilterOption[]
  >([]);
  const [open, setOpen] = useState(false);

  const [getRoles, { data: roles, isLoading: isRoleLoading }] =
    useLazyGetRolesQuery();
  const [getBuildings, { data: buildings }] = useLazyGetBuildingsQuery();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isRoleLoading || isRegisterLoading;

  const formik = useFormik<RegisterForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      reason: "",
      role: null,
      buildingId: null, 
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await register(values).unwrap();
        navigate(`/register/${values.email}`);
      } catch (err) {
        if (isReduxError(err) && isApiError(err.data)) {
          const { errorCode, messages } = err.data;
          const [message] = messages;

          if (errorCode === "EMAIL_ALREADY_EXISTS") {
            setFieldError("email", message);
            setErrorMessage(message);
          } else if (errorCode === "ROLE_NOT_FOUND") {
            setFieldError("role", message);
            setErrorMessage(message);
          }
        }
      }
    },
  });

  const handleNextStep = () => {
    formik.setFieldTouched("name", true);
    formik.setFieldTouched("email", true);
    formik.setFieldTouched("password", true);
    if (
      formik.values.name.length !== 0 &&
      !Boolean(formik.errors.name) &&
      formik.values.email.length !== 0 &&
      !Boolean(formik.errors.email) &&
      formik.values.password.length !== 0 &&
      !Boolean(formik.errors.password)
    ) {
      setNextStep(true);
    } else {
      setNextStep(false);
    }
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  const getBuildingsDelayed = useMemo(() => {
    return debounce((query: string) => {
      getBuildings({ query, limit: 5 }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((u) => ({ id: u.id, name: u.name }))
            : []
        );
        setIsBuildingFilterLoading(false);
      });
    }, 250);
  }, [getBuildings]);

  useEffect(() => {
    if (open) {
      getBuildings({ limit: 5 }).then(({ data }) => {
        setBuildingFilterOptions(
          data !== undefined
            ? data.map((u) => ({ id: u.id, name: u.name }))
            : []
        );
      });
    }
  }, [open]);

  useEffect(() => {
    getRoles(null);
    getBuildings(null);
  }, [getRoles, getBuildings]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          position: "absolute",
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat-x",
          minHeight: "100%",
          minWidth: "100%",
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
          {roles && roles.length > 0 ? (
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  bgcolor: "white",
                  boxShadow: 1,
                  borderRadius: 1,
                  p: 2,
                  minWidth: 300,
                  width: "60vw",
                  maxWidth: 200,
                }}
              >
                <Typography
                  variant="h4"
                  textAlign="center"
                  sx={{ marginBottom: 2 }}
                >
                  Register
                </Typography>
                {nextStep ? (
                  <>
                    <Box sx={{ marginBottom: 3, width: "100%" }}>
                      <Typography
                        sx={{
                          marginBottom: 1,
                          textAlign: "center",
                        }}
                        variant="h6"
                      >
                        Please choose your role and building domain
                      </Typography>
                      <FormControl fullWidth sx={{ marginBottom: 3 }}>
                        <InputLabel id="role">Role</InputLabel>
                        <Select
                          labelId="role"
                          id="role"
                          label="Role"
                          value={
                            formik.values.role !== null
                              ? formik.values.role
                              : ""
                          }
                          defaultValue=""
                          onChange={(e) => {
                            formik.setFieldValue("role", e.target.value);
                          }}
                          error={
                            formik.touched.role && Boolean(formik.errors.role)
                          }
                        >
                          {roles.map((role) => (
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
                      <Autocomplete
                        loading={isBuildingFilterLoading}
                        options={buildingFilterOptions}
                        open={open}
                        onOpen={() => {
                          setOpen(true);
                        }}
                        onClose={() => {
                          setOpen(false);
                        }}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        fullWidth
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.id}>
                              {option.name}
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Building"
                            error={
                              formik.touched.buildingId &&
                              Boolean(formik.errors.buildingId)
                            }
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {isBuildingFilterLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        value={buildingFilter}
                        onChange={(_, inputValue) => {
                          setBuildingFilterOptions([]);
                          setBuildingFilter(inputValue);
                        }}
                        onInputChange={(_, newInputValue, reason) => {
                          if (reason === "input") {
                            setIsBuildingFilterLoading(true);
                            setBuildingFilterOptions([]);
                            getBuildingsDelayed(newInputValue);
                          }
                        }}
                      />
                      {formik.touched.buildingId && formik.errors.buildingId ? (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            marginTop: "3px",
                            marginRight: "14px",
                            color: "#D32F2F",
                          }}
                        >
                          {formik.errors.buildingId}
                        </Typography>
                      ) : null}
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
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ marginBottom: 3 }}>
                      <Typography>Name</Typography>
                      <TextField
                        autoComplete="off"
                        id="name"
                        name="name"
                        onChange={(e) => {
                          formik.setFieldValue("name", e.target.value);
                        }}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
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
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
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
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
                        variant="standard"
                        type="password"
                        fullWidth
                      />
                    </Box>
                    <Box sx={{ marginBottom: 3 }}>
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
                        helperText={
                          formik.touched.reason && formik.errors.reason
                        }
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
                        sx={{ marginBottom: 0.5 }}
                        onClick={handleNextStep}
                        endIcon={isLoading && <CircularProgress />}
                      >
                        OK
                      </Button>
                    </Box>
                  </>
                )}
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
