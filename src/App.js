import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // 예시로 홈 페이지 추가
import './App.css';
import VideoConference from './pages/VideoConference';

import Layout from './components/Layout';
import ChatRoom from './components/room/ChatRoom';
import { GroupProvider } from './contexts/GroupContext';
import { MemberProvider } from './contexts/MemberContext';
import GroupWaitingPage from './pages/GroupWatingPage';
import FriendWaitingPage from './pages/FriendWaitingPage';
import { GroupNotificationProvider } from './contexts/GroupNotificationContext';
import { FriendNotificationProvider } from './contexts/FriendNotificationContext';

// Google OAuth2 클라이언트 ID
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; 

const App = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <MemberProvider>
        <GroupProvider>
          <FriendNotificationProvider>
            <GroupNotificationProvider>
              <Router>
                <Routes >
                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/video" element={<VideoConference/>}/>
                    <Route element={<Layout />}>

                      {/* 기본 홈 페이지 */}
                      <Route path="/" element={<HomePage />}  />
                      <Route path="/chat" element={<ChatRoom/>}/>
                      <Route path='/group/wait' element={<GroupWaitingPage/>}/>
                      <Route path='/friend/wait' element={<FriendWaitingPage/>}/>
                    
              
                    </Route>
                </Routes>
              </Router>
            </GroupNotificationProvider>
          </FriendNotificationProvider>
        </GroupProvider>
      </MemberProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
