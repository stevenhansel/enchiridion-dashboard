import React, { useEffect, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Layout from "./components/Layout";
import AnnouncementPage from "./pages/AnnouncementPage";
import DevicePage from "./pages/DevicePage";
import ListFloorPage from "./pages/ListFloorPage";
import ListFloorPageAPI from "./pages/ListFloorPageAPI";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAnnouncementPage from "./pages/CreateAnnouncementPage";
import RolesPage from "./pages/RolesPage";
import ListUsersPage from './pages/ListUsersPage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestsPage from "./pages/RequestsPage";
import SendLinkVerificationPage from './pages/SendLinkVerificationPage';
import VerificationCallbackPage from './pages/VerificationCallbackPage';
import WaitingApprovalPage from "./pages/WaitingApprovalPage";
import UserProfilePage from './pages/UserProfilePage';

import axios from './utils/axiosInstance'

import { RootState } from './store';

function App() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth)

  const userStateData = useSelector((state: RootState) => state.profile?.userStatus);
  
  const handleMe = useCallback(async () => {
    try{
      await axios.get('/v1/me');
    } catch {

    }
  }, []);

  useEffect(() => {
    // handleMe();
  }, []);


  if (userStateData === "WaitingForApproval" && isAuth === true) {
    return <WaitingApprovalPage />
  }


  return (
    <BrowserRouter>
      {isAuth ? (
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
              path: "list-user",
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
            <Route path="/" element={<AnnouncementPage />} />
            <Route path="/announcement/create" element={<CreateAnnouncementPage />} />
            <Route path="/device" element={<DevicePage />} />
            <Route path="/device/:id" element={<DeviceDetailPage />} />
            <Route path="/floor" element={<ListFloorPageAPI />} />
            <Route path="/list-user" element={<ListUsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/requests" element={<RequestsPage />}/>
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:email" element={<SendLinkVerificationPage />} />
          <Route path="/verification" element={<VerificationCallbackPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/waiting-approval" element={<WaitingApprovalPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
