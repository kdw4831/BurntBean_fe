import React from 'react';
import '../styles/LoginPage.css'; // 스타일을 추가할 경우
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Box, Typography } from '@mui/material';
import burntBeanLogin from '../assets/image/burntBean-login.webp';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="text-section">
          <div className="logo">화상콩</div>
          <Typography>
            안녕하세요 <br />화상회의 플랫폼 <span className="platform-name">화상콩</span>입니다.
          </Typography>

          <Box className="image-section" sx={{ mt: 2 , mb: 2}}>
            <Box 
              component="img" 
              src={burntBeanLogin} 
              alt="Login Illustration" 
              sx={{ width: '300px', height: 'auto' }} 
            />
          </Box>
          <GoogleLoginButton/>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
