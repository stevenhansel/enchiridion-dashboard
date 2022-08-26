import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { useLazyLogoutQuery } from "../services/auth";

import { logout } from "../store/auth";
import { AppDispatch } from "../store";

const LogoutButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const [userLogout, { data, isLoading, error }] = useLazyLogoutQuery();

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    userLogout(null);
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
