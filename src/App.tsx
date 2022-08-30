import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ListAnnouncementPage from "./pages/ListAnnouncementPage";
import DevicePage from "./pages/DevicePage";
import ListFloorPage from "./pages/ListFloorPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAnnouncementPage from "./pages/CreateAnnouncementPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import ListUsersPage from "./pages/ListUsersPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestsPage from "./pages/RequestsPage";
import SendLinkVerificationPage from "./pages/SendLinkVerificationPage";
import VerificationCallbackPage from "./pages/VerificationCallbackPage";
import WaitingApprovalPage from "./pages/WaitingApprovalPage";

import { setProfile } from "./store/profile";
import { ApiErrorResponse } from "./services/error";

import { authApi } from "./services/auth";
import { AppDispatch, RootState } from "./store";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.profile !== null
  );

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
          isEmailConfirmed: response.data.isEmailConfirmed,
          userStatus: response.data.userStatus,
        })
      );
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
    return <div />;
  }

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<ListAnnouncementPage />} />
          <Route
            path="/announcement/create"
            element={<CreateAnnouncementPage />}
          />
          <Route
            path="/announcement/detail/:announcementId"
            element={<AnnouncementDetailPage />}
          />
          <Route path="/device" element={<DevicePage />} />
          <Route
            path="/device/detail/:deviceId"
            element={<DeviceDetailPage />}
          />
          <Route path="/floor" element={<ListFloorPage />} />
          <Route path="/list-user" element={<ListUsersPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          {/** <Route path="/profile" element={<UserProfilePage />} />*/}
          <Route
            path="/waiting-for-approval"
            element={<WaitingApprovalPage />}
          />
        </Routes>
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
