import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Layout from "./components/Layout";
import AnnouncementPage from "./pages/AnnouncementPage";
import DevicePage from "./pages/DevicePage";
import ListFloorPage from "./pages/ListFloorPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import Login from "./pages/Login";

function App() {

  const [login, setLogin] = useState(true);

  return (
    login ? (<Login />) : (
      <BrowserRouter>
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
              text: "Profile",
              path: "profile",
              icon: <AccountBoxIcon />,
            },
          ]}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/announcement" element={<AnnouncementPage />} />
            <Route path="/device" element={<DevicePage />} />
            <Route path="/device/:id" element={<DeviceDetailPage />} />
            <Route path="/floor" element={<ListFloorPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    ) 

  );
}

export default App;
