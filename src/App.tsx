import React, { useState } from "react";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/index";

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Layout from "./components/Layout";
import AnnouncementPage from "./pages/AnnouncementPage";
import DevicePage from "./pages/DevicePage";
import ListFloorPage from "./pages/ListFloorPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAnnouncementPage from "./pages/CreateAnnouncementPage";
import RolesPage from "./pages/RolesPage";
import ListUsersPage from './pages/ListUsersPage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestsPage from "./pages/RequestsPage";

function App() {
  const isLogin = useSelector((state: RootState) => state.auth.isAuth)

  return (
    <BrowserRouter>
      {isLogin ? (
        <Layout
          navigation={[
            {
              text: "Announcement",
              path: "announcement",
              icon: <HomeIcon />,
            },
            {
              text: "Device",
              path: "device",
              icon: <TvIcon />,
            },
            {
              text: "Floor",
              path: "floor",
              icon: <BalconyIcon />,
            },
            {
              text: "List User",
              path: "list_user",
              icon: <AccountBoxIcon />,
            },
            {
              text: "Roles",
              path: "roles",
              icon: <AccessibilityIcon />,
            },
            {
              text:"Requests",
              path: "requests",
              icon: <AssignmentIcon />,
            }
          ]}
        >
          <Routes>
            <Route path="/announcement" element={<AnnouncementPage />} />
            <Route path="/announcement/create" element={<CreateAnnouncementPage />} />
            <Route path="/device" element={<DevicePage />} />
            <Route path="/device/:id" element={<DeviceDetailPage />} />
            <Route path="/floor" element={<ListFloorPage />} />
            <Route path="/list_user" element={<ListUsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/requests" element={<RequestsPage />}/>
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
