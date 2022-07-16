import React from 'react';

import {
  Box,
  CssBaseline,
  Typography,
} from "@mui/material";

type Props = {
  children?: React.ReactNode;
};

const WaitingApprovalPage = (props: Props) => {


  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        style={{
          backgroundImage:
            "url('https://www.superherohype.com/assets/uploads/2020/08/The-Boys-Season-2-Trailer-1280x720.png')",
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
            <Box display="flex" justifyContent="center" flexDirection="row">
                <Typography>Waiting for Approval</Typography>
            </Box>
          </Box>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default WaitingApprovalPage;