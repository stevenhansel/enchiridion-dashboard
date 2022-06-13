import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import AnnouncementPage from "./AnnouncementPage";

type Props = {
  children?: React.ReactNode;
};

const Login = (props: Props) => {
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
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage:
            "url('https://s3-alpha-sig.figma.com/img/89f3/b5fd/bd6aa14691c184f40bd800355c856063?Expires=1655683200&Signature=B3zs2Kpd5FTqP6enUbVoZZ2LiKqKk21pE~bxZJZUi-lXuSdP0UKjTTTz1aXfi89Qzxu3mXHcRNZ5dqFd59Bbb96IuDWWSfFKieoQjoEy2jwE2cARGMn5qNXtcbOCwBKYT7TMOj26~e6~Nb8u4tf39Z-xuuBWI-Nn8iJ-m0rsnw14TU6bCoXFnbLXL4C7GeT50ZmEKuklixhb1CN2o8f2iY4nyyjAQWOv6NMuYhNNUDtZ82XiqRpaSDvt2cFgUSCiBYr3zbOlnQ~mwTQAk~tH3seXu-HuS05uA0ka~ySMppUjH-s1W7OyeNQHN-S6DgrrHW7a8OCMzA9ZW5Vra4w4TQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA')",
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
              <Box sx={{ marginBottom: 5 }}>
                <Typography>Email</Typography>
                <TextField
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box sx={{ marginBottom: 5 }}>
                <Typography>Password</Typography>
                <TextField
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
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
