import React, { useEffect, useState } from 'react';
import { Modal, Box, Tabs, Tab } from '@mui/material';
import FriendInviteTab from './tab/FriendInviteTab';
import NicknameInviteTab from './tab/NicknameInviteTab';
import { axiosClient } from '../../utils/axiosClient';
import { useGroup } from '../../contexts/GroupContext';
import { useMember } from '../../contexts/MemberContext';

function InviteModal({ open, onClose }) {
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([]);
  const [members, setMembers] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]); // 방 멤버 목록
  const { groupId } = useGroup();
  const { meId } = useMember(); // 내 ID

  useEffect(() => {
    // 방의 상세 정보 가져오기
    if (groupId) {
      axiosClient.get(`/room/detail/${groupId}`)
        .then(response => {
          setRoomMembers(response.data.members); // 방에 속해 있는 멤버 목록 저장
        })
        .catch(error => {
          console.error('방의 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
        });
    }
  }, [groupId]);

  useEffect(() => {
    // 친구 목록 가져오기
    axiosClient.get('/friend/list')
      .then(response => {
        // 방 멤버와 나 자신을 제외하고 친구 목록 필터링
        const filteredFriends = response.data.filter(friend => 
          friend.id !== meId && !roomMembers.some(member => member.id === friend.id)
        );
        setFriends(filteredFriends);
      })
      .catch(error => {
        console.error('친구 목록을 가져오는 중 오류가 발생했습니다:', error);
      });

    // 멤버 목록 가져오기
    axiosClient.get('/member/list')
      .then(response => {
        // 방 멤버와 나 자신을 제외하고 멤버 목록 필터링
        const filteredMembers = response.data.filter(member => 
          member.id !== meId && !roomMembers.some(roomMember => roomMember.id === member.id)
        );
        setMembers(filteredMembers);
      })
      .catch(error => {
        console.error('멤버 목록을 가져오는 중 오류가 발생하였습니다.', error);
      });
  }, [roomMembers, meId]);

  useEffect(() => {
    // 그룹이 변경될 때 초대 상태 초기화
    setMembers(prevMembers =>
      prevMembers.map(member => ({ ...member, invited: false }))
    );
    setFriends(prevFriends =>
      prevFriends.map(friend => ({ ...friend, invited: false }))
    );
  }, [groupId]);

  const handleInvite = (memberId, type) => {
    if (type === 'friend') {
      setFriends(prevFriends => 
        prevFriends.map(friend =>
          friend.id === memberId ? { ...friend, invited: true } : friend
        )
      );
    } else if (type === 'member') {
      setMembers(prevMembers => 
        prevMembers.map(member =>
          member.id === memberId ? { ...member, invited: true } : member
        )
      );
    }
  };

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
            onInvite={(index) => handleInvite(index, 'friend')}
          />
        ) : (
          <NicknameInviteTab 
            members={members}
            search={search}
            onSearchChange={setSearch}
            onInvite={(index) => handleInvite(index, 'member')}
          />
        )}
      </Box>
    </Modal>
  );
}

export default InviteModal;
