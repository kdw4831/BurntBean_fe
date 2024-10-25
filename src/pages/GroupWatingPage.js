import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, Divider, Avatar } from '@mui/material';
import { axiosClient } from '../utils/axiosClient';
import { grey } from '@mui/material/colors';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMember } from '../contexts/MemberContext';

const GroupWaitingPage = () => {
  const [invitations, setInvitations] = useState([]);
  const socketUrl = 'http://localhost:9000/ws'; // WebSocket 엔드포인트 URL
  const { id } = useMember();
  let myId = id;

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axiosClient.get('/room/request/list');
        setInvitations(response.data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations(); // 컴포넌트 로드 시 한 번 호출

    const socketFactory = () => new SockJS(socketUrl);
    const stompClient = Stomp.over(socketFactory);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/queue/notification/${myId}`, () => {
        fetchInvitations(); // 초대 알림 수신 시 데이터를 다시 가져옴
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [myId]);

  const handleAcceptInvitation = async (roomId) => {
    try {
      await axiosClient.get(`/room/request/accept?roomId=${roomId}`);
      // 참여 성공 후 다시 데이터를 불러옵니다.
      setInvitations((prev) => prev.filter((invite) => invite.id !== roomId));
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>그룹 대기 목록</Typography>
      <Divider />
      {invitations.length === 0 ? (
        <Typography sx={{ mt: 2, color: grey[600] }}>
          현재 그룹초대 대기목록이 존재하지 않습니다.
        </Typography>
      ) : (
        invitations.map((invite, index) => (
          <Paper key={index} sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: grey[500], marginRight: 2 }}>
              {invite.groupName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography>{`${invite.groupName}방  (현재 인원:${invite.total}명)`}</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => handleAcceptInvitation(invite.id)}
              >
                참여하기
              </Button>
              <Button variant="outlined" color="secondary">
                거절하기
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  
  );
};

export default GroupWaitingPage;