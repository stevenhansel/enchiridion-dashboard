import * as React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import backgroundImage from '../assets/jpg/background-auth.jpeg';

const validationSchema = yup.object({
  email: yup.string().email('Enter your Email').required('Email is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      navigate('/reset_password');
    },
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'repeat-x',
          height: '100vh',
          width: '100ww',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            bottom: '50%',
            right: '50%',
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                bgcolor: 'white',
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
                Forgot Password
              </Typography>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>Email</Typography>
                <TextField
                  id="email"
                  name="email"
                  variant="standard"
                  fullWidth
                  onChange={e => formik.setFieldValue('email', e.target.value)}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
                  Send
                </Button>
              </Box>
            </Box>
          </form>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default ForgotPassword;
