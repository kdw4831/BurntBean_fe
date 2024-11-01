import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, List, ListItem, Typography } from '@mui/material';
import { axiosClient } from '../../utils/axiosClient';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import FriendInviteModal from './FriendInviteModal'; // Modal 컴포넌트 import
import { useFriendNotification } from '../../contexts/FriendNotificationContext';
import { useGroup } from '../../contexts/GroupContext';
import { useNavigate } from 'react-router-dom';

function FriendSideBar() {
  const [friends, setFriends] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Modal 상태 추가
  const {invitationCount} = useFriendNotification();
  const navigate = useNavigate(); 
  const { setGroupId, setGroupName, setTotal, setRtype, setMembers,members } = useGroup(); 

  // 친구 목록 불러오기
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosClient.get('/friend/list');
        setFriends(response.data); // 초기 친구 목록 설정
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [invitationCount]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:9000/ws');
    const stompClient = Stomp.over(socket);
    stompClient.reconnectDelay = 5000;

    stompClient.connect({}, () => {
      stompClient.subscribe('/status/updates', (message) => {
        const updatedStatus = JSON.parse(message.body);

        setFriends((prevFriends) => {
          const updatedFriends = prevFriends.map((friend) =>
            friend.id === Number(updatedStatus.userId)
              ? { ...friend, status: updatedStatus.status }
              : friend
          );
          return [...updatedFriends];
        });
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      }
    };
  }, []);

  // Modal 열기/닫기 함수
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  const handleFriendClick = async(friendId) =>{
    const res= await axiosClient.get(`/room/detail/dm?friendId=${friendId}`)
    setGroupId(res.data.id)
    setGroupName(res.data.groupName)
    setTotal(res.data.total)
    setRtype(res.data.rtype)
    setMembers(res.data.members)
    navigate(`/chat`); 
  }

  return (
    <Box sx={{ width: 300, bgcolor: '#3C3D37', p: 2 }}>
      <Typography color="white" variant="h6" noWrap>
        Friends
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#2e7d32', // 어두운 그린 배경색
            color: 'white',
            '&:hover': {
              bgcolor: '#1b5e20', // hover 시 어두운 그린
            },
            width: '100%',
            marginBottom: '8px',
            marginTop: '16px'
          }}
          onClick={handleOpenModal} // 버튼 클릭 시 모달 열기
        >
          친구 추가 요청
        </Button>
        <Box
          sx={{
            borderBottom: '1px solid #fff',
            margin: '16px 0',
          }}
        />
      </Box>
      <List>
        {friends && friends.length > 0 ? ( // friends가 null이 아니고, 길이가 0보다 큰 경우
          friends.map((friend,index) => (
            <ListItem key={index}
            button
            onClick={() => handleFriendClick(friend.id)}
            >
              <Avatar src={friend.profile} sx={{ mr: 2 }} />
              <Typography color="white" sx={{ fontSize: '15px' }}>
                {friend.nick}
              </Typography>
              <Typography color="white" variant="caption" sx={{ ml: 1 }}>
                {friend.status === 'online' ? '온라인' : '오프라인'}
              </Typography>
            </ListItem>
          ))
        ) : (
          <ListItem sx={{ justifyContent: 'center' }}> {/* 가운데 정렬을 위한 스타일 추가 */}
            <Typography color="white" sx={{ fontSize: '15px', textAlign: 'center' }}>
              친구를 추가해주세요!
            </Typography>
          </ListItem>
        )}
      </List>


      {/* 모달 컴포넌트 추가 */}
      <FriendInviteModal open={modalOpen} onClose={handleCloseModal} />
    </Box>
  );
}

export default FriendSideBar;
