import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { useLogoutQuery } from "../services/auth";

import { logout } from "../store/auth";
import { AppDispatch } from "../store";

const LogoutButton = () => {
  const dispatch: AppDispatch = useDispatch();
  
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
