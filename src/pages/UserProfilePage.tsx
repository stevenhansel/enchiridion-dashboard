import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from "../store/auth";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

type Props = {
  children?: React.ReactNode;
};

const UserProfilePage = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event: any) => {
    setAuth(event.target.checked);
  };

  const handleLogout = () => {
    navigate("/login");
    dispatch(logout());
  }

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        sx={{
          bgcolor: "lightblue",
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
          width="100%"
        >
          <Typography variant="h5" fontWeight="bold">
            Emily
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography>Hi,</Typography>
          <Typography fontWeight="bold">Emily</Typography>
        </Box>
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            {auth && (
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <ExpandMoreIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <AccountCircle sx={{ marginRight: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ marginRight: 1 }} />
                    Log Out
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: 5 }}>
        <Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              ID
            </Typography>
            <Typography>Emily00</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Nama</Typography>
            <Typography>Emily</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography>Emilyhannah@gmail.com</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Status</Typography>
            <Typography>Mahasiswa</Typography>
          </Box>
        </Box>
        <Box sx={{ marginLeft: 40 }}>
          <Box sx={{ marginBottom: 5 }}>
            <Typography display="flex" fontWeight="bold">
              Posisi
            </Typography>
            <Typography>Mahasiswa</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Alasan untuk daftar</Typography>
            <Typography>ingin menginfokan UKM</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Terdaftar pada tanggal</Typography>
            <Typography>2 Juni 2022</Typography>
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            <Typography fontWeight="bold">Data Update terakhir</Typography>
            <Typography>Version 2.0</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
        <Button variant="contained" sx={{ marginRight: 1 }}>
          Ganti Password
        </Button>
        <Button variant="outlined">Edit</Button>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
