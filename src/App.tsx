import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import TvIcon from '@mui/icons-material/Tv';

import Layout from './components/Layout';
import AnnouncementPage from './pages/AnnouncementPage';
import DevicePage from './pages/DevicePage';

function App() {
  return (
    <BrowserRouter>
      <Layout
        navigation={[
          {
            text: 'Announcement',
            path: '/',
            icon: <HomeIcon />,
          },
          {
            text: 'Device',
            path: 'device',
            icon: <TvIcon />,
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<AnnouncementPage />} />
          <Route path="/device" element={<DevicePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
