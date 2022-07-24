import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import BalconyIcon from "@mui/icons-material/Balcony";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AssignmentIcon from "@mui/icons-material/Assignment";

import Layout from "./components/Layout";
import ListAnnouncementPage from "./pages/ListAnnouncementPage";
import DevicePage from "./pages/DevicePage";
import ListFloorPage from "./pages/ListFloorPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAnnouncementPage from "./pages/CreateAnnouncementPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import RolesPage from "./pages/RolesPage";
import ListUsersPage from "./pages/ListUsersPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestsPage from "./pages/RequestsPage";
import SendLinkVerificationPage from "./pages/SendLinkVerificationPage";
import VerificationCallbackPage from "./pages/VerificationCallbackPage";
import WaitingApprovalPage from "./pages/WaitingApprovalPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserStatusWrapper from "./components/UserStatusWrapper";

import { setProfile } from "./store/profile";
import { login } from "./store/auth";
import { ApiErrorResponse } from "./services";

import { authApi } from "./services/auth";
import { AppDispatch, RootState } from "./store";

function App() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [, setErrorMessage] = useState("");

  const handleMe = useCallback(async () => {
    setIsLoading(true);

    const response = await dispatch(authApi.endpoints.me.initiate(""));
    if ("data" in response) {
      dispatch(
        setProfile({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          role: response.data.role,
          userStatus: response.data.userStatus,
        })
      );
      dispatch(login());
    } else {
      setErrorMessage(
        response.error && "data" in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : "Network Error"
      );
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    handleMe();
  }, []);

  if (isLoading) {
    return <div/>;
  }

  return (
    <BrowserRouter>
      {isAuth ? (
        <Layout
          navigation={[
            {
              text: "Announcement",
              path: "",
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
              text: "Requests",
              path: "requests",
              icon: <AssignmentIcon />,
            },
          ]}
        >
          <Routes>
            <Route
              path="/"
              element={
                <UserStatusWrapper>
                  <ListAnnouncementPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/announcement/create"
              element={
                <UserStatusWrapper>
                  <CreateAnnouncementPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/announcement/detail/:announcementId"
              element={
                <UserStatusWrapper>
                  <AnnouncementDetailPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/device"
              element={
                <UserStatusWrapper>
                  <DevicePage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/device/:id"
              element={
                <UserStatusWrapper>
                  <DeviceDetailPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/floor"
              element={
                <UserStatusWrapper>
                  <ListFloorPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/list-user"
              element={
                <UserStatusWrapper>
                  <ListUsersPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/roles"
              element={
                <UserStatusWrapper>
                  <RolesPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/requests"
              element={
                <UserStatusWrapper>
                  <RequestsPage />
                </UserStatusWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <UserStatusWrapper>
                  <UserProfilePage />
                </UserStatusWrapper>
              }
            />
            <Route path="/waiting-approval" element={<WaitingApprovalPage />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/register/:email"
            element={<SendLinkVerificationPage />}
          />
          <Route path="/verification" element={<VerificationCallbackPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
