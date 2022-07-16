import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccessibilityIcon from '@mui/icons-material/Accessibility';

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

function App() {
  // const isLogin = useSelector((state: RootState) => state.auth.isAuth)
  const isLogin = false;

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
              text: "Profile",
              path: "profile",
              icon: <AccountBoxIcon />,
            },
            {
              text: "Roles",
              path: "roles",
              icon: <AccessibilityIcon />,
            },
          ]}
        >
          <Routes>
            <Route path="/announcement" element={<AnnouncementPage />} />
            <Route path="/announcement/create" element={<CreateAnnouncementPage />} />
            <Route path="/device" element={<DevicePage />} />
            <Route path="/device/:id" element={<DeviceDetailPage />} />
            <Route path="/floor" element={<ListFloorPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/roles" element={<RolesPage />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
