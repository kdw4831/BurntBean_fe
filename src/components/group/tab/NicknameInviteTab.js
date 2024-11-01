// NicknameInviteTab.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, ListItemAvatar, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { axiosClient } from '../../../utils/axiosClient';
import { useGroup } from '../../../contexts/GroupContext';

function NicknameInviteTab({ members, search, onSearchChange, onInvite }) {
  const { groupId } = useGroup();
  
  const handleInviteClick = (memberId) => {
    const member = members.find((m) => m.id === memberId);
  
    axiosClient.get('/room/join/request', {
      params: {
        roomId: groupId,
        nick: member.nick
      }
    })
    .then(response => {
      console.log('초대 요청 성공:', response.data);
      sendInvite(member.id, `${member.nick}님을 초대했습니다.`);
      onInvite(member.id, 'member'); // 성공 시 식별자를 기반으로 초대 상태 업데이트
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
        label="닉네임으로 초대"
        variant="outlined"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      {search && (
        <List>
          {members
            .filter((member) => member.nick.includes(search))
            .map((member, index) => (
              <ListItem key={index}
                secondaryAction={
                  member.invited ? (
                    <IconButton edge="end" disabled>
                      <CheckCircleIcon color="success" />
                    </IconButton>
                  ) : (
                    <IconButton edge="end" onClick={() => handleInviteClick(member.id)}>
                      <AddIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.profile} alt={`${member.nick}의 프로필`} />
                </ListItemAvatar>
                <ListItemText primary={member.nick} />
              </ListItem>
            ))}
        </List>
      )}
    </>
  );
}

export default NicknameInviteTab;
