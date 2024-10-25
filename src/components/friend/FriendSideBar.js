import React, { useEffect, useState } from 'react';
import { Avatar, Box, List, ListItem, Typography } from '@mui/material';
import { axiosClient } from '../../utils/axiosClient';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function FriendSideBar() {
  const [friends, setFriends] = useState([]);

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
  }, []);


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

    

  return (
    <Box sx={{ width: 300, bgcolor: '#3C3D37', p: 2 }}>
      <Typography color="white" variant="h6" noWrap>
        Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend.id} button>
            <Avatar src={friend.profile} sx={{ mr: 2 }} />
            <Typography color="white" sx={{ fontSize: '15px' }}>
              {friend.nick}
            </Typography>
            <Typography color="white" variant="caption" sx={{ ml: 1 }}>
              {friend.status === 'online' ? '온라인' : '오프라인'}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default FriendSideBar;
