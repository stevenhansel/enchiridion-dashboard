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
  newPassword: yup
    .string()
    .min(8, 'New Password should be of minimum 8 characters length')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword'), null], 'Password must match'),
});

const ResetPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      //   alert(JSON.stringify(values, null, 2));
      navigate('/login');
    },
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage: `${backgroundImage}`,
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
                Reset Password
              </Typography>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>New Password</Typography>
                <TextField
                  id="new_password"
                  name="new_password"
                  variant="standard"
                  type="password"
                  fullWidth
                  onChange={event =>
                    formik.setFieldValue('newPassword', event.target.value)
                  }
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                />
              </Box>
              <Box sx={{ marginBottom: 3 }}>
                <Typography>Confirm New Password</Typography>
                <TextField
                  id="confirm_password"
                  name="confirm_password"
                  variant="standard"
                  type="password"
                  fullWidth
                  onChange={event =>
                    formik.setFieldValue('confirmPassword', event.target.value)
                  }
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
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
                  Change Password
                </Button>
              </Box>
            </Box>
          </form>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default ResetPassword;
