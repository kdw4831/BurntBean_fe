import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Divider, Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { axiosClient } from '../utils/axiosClient';
import { useMember } from '../contexts/MemberContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import { useFriendNotification } from '../contexts/FriendNotificationContext';

const FriendWaitingPage = () => {
  const [invitations, setInvitations] = useState([]);
  const socketUrl = 'http://localhost:9000/ws'; // WebSocket 엔드포인트 URL
  const {invitationAccept } = useFriendNotification();
  const { meId } = useMember();
  const nav =useNavigate();
 
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axiosClient.get('/friend/request/list');
        setInvitations(response.data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };
  
    fetchInvitations(); // 컴포넌트 로드 시 한 번 호출
  
    const socketFactory = () => new SockJS(socketUrl);
    const stompClient = Stomp.over(socketFactory);
  
    stompClient.connect({}, () => {
      stompClient.subscribe(`/queue/notification/friend/${meId}`, async () => {
        console.log("초대 알림 수신");
        await fetchInvitations(); // 초대 알림 수신 시 데이터를 다시 가져옴
      });
    });
  
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [meId]);
  

  const handleAcceptInvitation = async (memberId) => {
    try {
      await axiosClient.get(`/friend/request/accept?toMemberId=${memberId}`);
      // 참여 성공 후 다시 데이터를 불러옵니다.
      setInvitations((prev) => prev.filter((invite) => invite.id !== memberId));
      invitationAccept()
    
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleRejectInvitation = async (memberId)=>{
    try{
      await axiosClient.delete(`/friend/request/reject?toMemberId=${memberId}`);
      setInvitations((prev) => prev.filter((invite) => invite.id !== memberId));
    }catch(error){
      console.error('Error rejecting invitation: ', error);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>친구 대기 목록</Typography>
      <Divider />
      {invitations.length === 0 ? (
        <Typography sx={{ mt: 2, color: grey[600] }}>
          현재 친구 초대 대기목록이 존재하지 않습니다.
        </Typography>
      ) : (
        invitations.map((friend, index) => (
          <Paper key={index} sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt="User Name" src={`${friend.profile}`} sx={{ width: 45, height: 45, marginRight: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography>{`${friend.nick}님께서 친구요청을 하였습니다.`}</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() =>{handleAcceptInvitation(friend.id)}}
              >
                참여하기
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={()=>{handleRejectInvitation(friend.id)}}
                >
                거절하기
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  
  );
};

export default FriendWaitingPage;
