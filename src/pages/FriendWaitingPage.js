import React from 'react';
import { Box, Typography, Button, Paper, Divider, Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';

const FriendWaitingPage = () => {
  const invitations = [
    { roomName: '옹근방', message: '에서 초대를 하였습니다' },
    { roomName: '옹근방', message: '에서 초대를 하였습니다' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>친구 대기 목록</Typography>
      <Divider />
      {invitations.map((invite, index) => (
        <Paper key={index} sx={{ p: 2, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         
          <Typography>{`${invite.roomName} room ${invite.message}`}</Typography>
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              참여하기
            </Button>
            <Button variant="outlined" color="secondary">
              거절하기
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default FriendWaitingPage;
