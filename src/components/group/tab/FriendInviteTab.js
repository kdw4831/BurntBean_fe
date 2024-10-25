// FriendInviteTab.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, ListItemAvatar, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { axiosClient } from '../../../utils/axiosClient';
import { useGroup } from '../../../contexts/GroupContext';

function FriendInviteTab({ friends, search, onSearchChange, onInvite }) {
  const { id } = useGroup();

  const handleInviteClick = (index) => {
    const friend = friends[index];

    // GET 요청을 보냄
    axiosClient.get('/room/join/request', {
      params: {
        roomId: id,
        nick: friend.nick
      }
    })
    .then(response => {
      console.log('초대 요청 성공:', response.data);
      sendInvite(friend.id, `${friend.nick}님을 초대했습니다.`);
      onInvite(index); // 성공하면 초대 상태 업데이트
    })
    .catch(error => {
      console.error('초대 요청 실패:', error);
    });
  };

  const sendInvite = async (inviteeId, message) => {
    try {
        await axiosClient.post(`/invite/send/${inviteeId}`, message, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        console.log("초대 알림 전송 성공");
    } catch (error) {
        console.error("초대 알림 전송 실패:", error);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        label="친구 찾기"
        variant="outlined"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List>
        {friends
          .filter((friend) => friend.nick.includes(search))
          .map((friend, index) => (
            <ListItem key={index}
              secondaryAction={
                friend.invited ? (
                  <IconButton edge="end" disabled>
                    <CheckCircleIcon color="success" />
                  </IconButton>
                ) : (
                  <IconButton edge="end" onClick={() => handleInviteClick(index)}>
                    <AddIcon />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={friend.profile} alt={`${friend.nick}의 프로필`} />
              </ListItemAvatar>
              <ListItemText primary={friend.nick} />
            </ListItem>
          ))}
      </List>
    </>
  );
}

export default FriendInviteTab;
