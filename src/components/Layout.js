import { Box, CssBaseline } from '@mui/material';
import React from 'react';

import { Outlet, useLocation } from 'react-router-dom';
import GroupSideBar from './group/GroupSideBar';
import FriendSideBar from './friend/FriendSideBar';
import NickInputModal from './modal/NickInputModal';
import TopBar from './bar/TopBar';
import RoomSideBar from './bar/RoomSideBar';
import 'animate.css';

const Layout = () => {
  const location = useLocation();
  
  const renderSidebar = () => {
    if (location.pathname.startsWith('/chat')) {
      return <RoomSideBar className ="animate__animated animate__bounce" />;
    } else {
      return <FriendSideBar />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh'}}>
      <CssBaseline />
      <GroupSideBar />
      {renderSidebar()}
      <NickInputModal />

      <Box sx={{ height: 'calc(100vh - 64px)', width: '100vw'}}>
        <TopBar />
        {/* Outlet은 현재 라우트의 하위 컴포넌트를 렌더링 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f0f0f0',
            p: 3,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
