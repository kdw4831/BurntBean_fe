
import { Typography, Box, List, ListItem, IconButton, Avatar, CssBaseline, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const HomePage = () => {
 
  return (
    <div>
      <Typography variant="h4">현재 활동 중</Typography>
      <Typography>지금은 조용하네요... 친구가 게임이나 음성 채팅과 같은 활동을 시작하면 여기에 표시돼요!</Typography>


    </div>
  );
};

export default HomePage;
