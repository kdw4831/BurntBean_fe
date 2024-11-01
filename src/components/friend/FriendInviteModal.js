import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar } from '@mui/material';
import { axiosClient } from '../../utils/axiosClient';
import { useMember } from '../../contexts/MemberContext';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FriendInviteModal = ({ open, onClose }) => {
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([]);
    const { meId } = useMember(); // 내 ID

    useEffect(() => {
        // 친구 목록 가져오기
        axiosClient.get('/friend/list')
            .then(response => {
                const friends = response.data;
                console.log("친구리스트 : ", friends);
                
                // 친구 목록을 가져온 후 멤버 목록 가져오기
                return axiosClient.get('/member/list')
                    .then(response => {
                        // 나 자신의 ID와 친구 목록의 ID를 제외하고 필터링
                        const filteredMembers = response.data.filter(member =>
                            member.id !== meId && !friends.some(friend => friend.id === member.id)
                        );
                        setMembers(filteredMembers);
                    });
            })
            .catch(error => {
                console.error('친구 또는 멤버 목록을 가져오는 중 오류가 발생했습니다:', error);
            });
    }, [meId]); // meId가 변경될 때만 실행

    const handleInviteClick = (memberId) => {
        const member = members.find(m => m.id === memberId);
        
        axiosClient.get('/friend/join/request', {
            params: {
                FromMemberId: member.id,
                nick: member.nick
            }
        })
        .then(response => {
            console.log('초대 요청 성공:', response.data);
            sendInvite(member.id, `${member.nick}님을 초대했습니다.`);
            handleInvite(member.id);
        })
        .catch(error => {
            console.error('초대 요청 실패:', error);
        });
    };

    const sendInvite = async (inviteeId, message) => {
        try {
            await axiosClient.post(`/invite/send/friend/${inviteeId}`, message, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            console.log("초대 알림 전송 성공");
        } catch (error) {
            console.error("초대 알림 전송 실패:", error);
        }
    };

    const handleInvite = (memberId) => {
        setMembers(prevMembers =>
            prevMembers.map(member =>
                member.id === memberId ? { ...member, invited: true } : member
            )
        );
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
                    height: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'hidden',
                    textAlign: 'center',
                }}
            >
                <Typography 
                    variant="h6"
                    color={"primary"} 
                    component="h2" 
                    sx={{ mb: 2 }}
                >
                    닉네임으로 친구 요청
                </Typography>
                <TextField
                    fullWidth
                    label="nick"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <List>
                    {search ? ( // 검색어가 있을 때만 필터링하여 목록을 보여줌
                        members.filter(member => member.nick.includes(search)).map((member) => (
                            <ListItem key={member.id} secondaryAction={
                                member.invited ? (
                                    <IconButton edge="end" disabled>
                                        <CheckCircleIcon color="success" />
                                    </IconButton>
                                ) : (
                                    <IconButton edge="end" onClick={() => handleInviteClick(member.id)}>
                                        <AddIcon />
                                    </IconButton>
                                )
                            }>
                                <ListItemAvatar>
                                    <Avatar src={member.profile} alt={`${member.nick}의 프로필`} />
                                </ListItemAvatar>
                                <ListItemText primary={member.nick} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="gray">친구의 닉네임을 입력해보세요</Typography> // 입력이 없을 때 안내 문구
                    )}
                </List>

            </Box>
        </Modal>
    );
};

export default FriendInviteModal;
