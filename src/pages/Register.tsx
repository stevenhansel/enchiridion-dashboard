import * as React from "react";
import { FormikConsumer, useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from '@mui/material/FormHelperText';

type Props = {
  children?: React.ReactNode;
};

const Register = (props: Props) => {
  const navigate = useNavigate();

  const [age, setAge] = React.useState("");

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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      navigate("/login");
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    formik.setFieldValue("role", event.target.value);
  };

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
                  fullWidth
                />
              </Box>
              <Box>
                <FormControl fullWidth sx={{ marginBottom: 5 }}>
                  <InputLabel
                    id="role"
                  >
                    Posisi
                  </InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={formik.values.role}
                    label="Age"
                    onChange={handleChange}
                    error={
                      formik.touched.role && Boolean(formik.errors.role)
                    }
                  >
                    <MenuItem value={"Mahasiswa"}>Mahasiswa</MenuItem>
                    <MenuItem value={"Dosen"}>Dosen</MenuItem>
                    <MenuItem value={"Karyawan"}>Karyawan</MenuItem>
                    <MenuItem value={"LSC"}>LSC</MenuItem>
                    <MenuItem value={"BM"}>BM</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                  </Select>
                  {formik.touched.role && formik.errors.role ? (<Typography sx={{ fontSize: 12, marginTop: 0.3754, color: "#D32F2F", }}>Roles is required</Typography>) : (null)}
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
                  type="submit"
                  sx={{ marginBottom: 0.5 }}
                >
                  Daftar
                </Button>
                <Box display="flex" flexDirection="row"></Box>
              </Box>
            </Box>
          </form>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default Register;
