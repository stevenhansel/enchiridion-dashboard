import React, { useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/jpg/background-auth.jpeg';
import { RootState } from '../store';
import { resetProfile } from '../store/profile';
import { useLazyLogoutQuery } from '../services/auth';

const WaitingApprovalPage = () => {
  const navigate = useNavigate();

  const profile = useSelector((state: RootState) => state.profile);

  const [logout] = useLazyLogoutQuery();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout(null).unwrap();
      dispatch(resetProfile());
    } catch (err) {
      // setErrorMessage('Logout failed');
    }
    navigate('/');
  };

  useEffect(() => {
    if (profile) {
      const { userStatus } = profile;
      if (userStatus.value !== 'waiting_for_approval') {
        navigate('/');
      }
    }
  }, [navigate, profile]);

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
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Button onClick={handleLogout}>back</Button>
              <Typography>Still Waiting for Approval</Typography>
              <CircularProgress color="inherit" sx={{ marginTop: 1 }} />
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default WaitingApprovalPage;
