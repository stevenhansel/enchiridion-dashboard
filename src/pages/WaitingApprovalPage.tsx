import React from 'react';

import {
  Box,
  CssBaseline,
  Typography,
  CircularProgress
} from "@mui/material";

import backgroundImage from '../assets/jpg/background-auth.jpeg';

type Props = {
  children?: React.ReactNode;
};

const WaitingApprovalPage = (props: Props) => {
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
          <Box
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              borderRadius: 1,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Typography>Still Waiting for Approval</Typography>
                <CircularProgress color="inherit" sx={{marginTop: 1}}/>
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default WaitingApprovalPage;