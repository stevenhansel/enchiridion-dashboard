import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "@mui/material";

import { useLazyLogoutQuery } from "../services/auth";
import { resetProfile } from "../store/profile";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const [logout] = useLazyLogoutQuery();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout(null).unwrap();
      dispatch(resetProfile());
    } catch (err) {

    }
    navigate("/");
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
