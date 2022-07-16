import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import { AppDispatch } from "../store";
import { login } from "../store/auth";

import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Props = {
  children?: React.ReactNode;
};

const Login = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(login());
      navigate('/announcement');
    },
  });

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
                  onChange={(event) => formik.setFieldValue("email", event.target.value)}
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
                  onChange={(event) => formik.setFieldValue("password", event.target.value)}
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
                  type="submit"
                  sx={{ marginBottom: 0.5 }}
                >
                  Masuk
                </Button>
                <Box display="flex" flexDirection="row">
                  <Typography sx={{ marginRight: 0.5 }}>
                    Belum punya akun?
                  </Typography>
                  <Link to="/register">Daftar</Link>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ marginTop: 1}}>
                  <Typography sx={{ marginRight: 0.5 }}>
                    Forgot Password?
                  </Typography>
                  <Link to="/forgot_password">Change</Link>
                </Box>
              </Box>
            </Box>
          </form>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default Login;
