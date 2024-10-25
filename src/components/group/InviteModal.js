import React, { useEffect, useState } from 'react';
import { Modal, Box, Tabs, Tab } from '@mui/material';
import FriendInviteTab from './tab/FriendInviteTab';
import NicknameInviteTab from './tab/NicknameInviteTab';
import { axiosClient } from '../../utils/axiosClient';



function InviteModal({ open, onClose}) {
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [invitedNicknames, setInvitedNicknames] = useState([]);
 
  useEffect(() => {
    // 컴포넌트가 마운트될 때 친구 목록을 가져옴
    axiosClient.get('/friend/list')
      .then(response => {
        setFriends(response.data);
      })
      .catch(error => {
        console.error('친구 목록을 가져오는 중 오류가 발생했습니다:', error);
      });
  }, []);
  
  const handleInvite = (index) => {
    setFriends(prevFriends => {
      const updatedFriends = [...prevFriends];
      updatedFriends[index].invited = true;
      return updatedFriends;
    });
  };

  const handleNicknameInvite = () => {
    if (search && !invitedNicknames.includes(search)) {
      setInvitedNicknames([...invitedNicknames, search]);
      setSearch('');
    }
  };

  const filteredNicknames = friends.filter(friend => 
    friend.nick.includes(search) && !friend.invited
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 500,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          overflow: 'hidden',
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)} 
          variant="fullWidth"
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              color: 'grey',
            },
            '& .Mui-selected': {
              color: 'black',
            }
          }}
        >
          <Tab label="친구 초대" />
          <Tab label="닉네임 초대" />
        </Tabs>

        {tabValue === 0 ? (
          <FriendInviteTab 
            friends={friends}
            search={search}
            onSearchChange={setSearch}
            onInvite={handleInvite}
          
          />
        ) : (
          <NicknameInviteTab 
            search={search}
            onSearchChange={setSearch}
            onInvite={handleNicknameInvite}
            filteredNicknames={filteredNicknames}
            invitedNicknames={invitedNicknames}
          />
        )}
      </Box>
    </Modal>
  );
}

export default InviteModal;
