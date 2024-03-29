import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ListAnnouncementPage from './pages/ListAnnouncementPage';
import DevicePage from './pages/DevicePage';
import ListFloorPage from './pages/ListFloorPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import ListUsersPage from './pages/ListUsersPage';
import RequestsPage from './pages/RequestsPage';
import SendLinkVerificationPage from './pages/SendLinkVerificationPage';
import VerificationCallbackPage from './pages/VerificationCallbackPage';
import WaitingApprovalPage from './pages/WaitingApprovalPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/Layout';
import { setProfile } from './store/profile';
import { ApiErrorResponse } from './services/error';
import { authApi } from './services/auth';
import { AppDispatch } from './store';

function App() {
  const dispatch: AppDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [_, setErrorMessage] = useState('');

  const handleMe = useCallback(async () => {
    setIsLoading(true);

    const response = await dispatch(authApi.endpoints.me.initiate(''));
    if ('data' in response) {
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
        response.error && 'data' in response.error
          ? (response.error.data as ApiErrorResponse).messages[0]
          : 'Network Error'
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
      <Routes>
        <Route
          path="/announcement"
          element={
            <Layout>
              <ListAnnouncementPage />
            </Layout>
          }
        />
        <Route
          path="/announcement/create"
          element={
            <Layout>
              <CreateAnnouncementPage />
            </Layout>
          }
        />
        <Route
          path="/announcement/detail/:announcementId"
          element={
            <Layout>
              <AnnouncementDetailPage />
            </Layout>
          }
        />
        <Route
          path="/device"
          element={
            <Layout>
              <DevicePage />
            </Layout>
          }
        />
        <Route
          path="/device/detail/:deviceId"
          element={
            <Layout>
              <DeviceDetailPage />
            </Layout>
          }
        />
        <Route
          path="/floor"
          element={
            <Layout>
              <ListFloorPage />
            </Layout>
          }
        />
        <Route
          path="/user"
          element={
            <Layout>
              <ListUsersPage />
            </Layout>
          }
        />
        <Route
          path="/requests"
          element={
            <Layout>
              <RequestsPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
        <Route path="/waiting-for-approval" element={<WaitingApprovalPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/verification" element={<VerificationCallbackPage />} />
        <Route path="/register/:email" element={<SendLinkVerificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
