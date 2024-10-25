import { AccountCircle, VideoCall, PersonAdd } from "@mui/icons-material";
import { Avatar, Box, Button, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InviteModal from "../group/InviteModal";
import { useGroup } from "../../contexts/GroupContext";
import { axiosClient } from "../../utils/axiosClient"; // axios 인스턴스 불러오기

function RoomSideBar() {
    const { id } = useGroup();
    let roomId = id;

    const [friends, setFriends] = useState([]);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    // API 요청을 통해 방 인원 정보 가져오기
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axiosClient.get(`/room/detail/${roomId}`);
                setFriends(response.data.members); // API 응답 데이터를 상태에 저장
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoomDetails();
    }, [roomId]); // roomId가 변경될 때마다 다시 API 요청

    const handleVideoCall = () => {
        window.open('/video', '_blank', 'noopener,noreferrer');
    };

    return (
        <Box sx={{ width: 300, bgcolor: '#3C3D37', p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Typography color={"white"} variant="h6" noWrap>
                방 인원
            </Typography>
            <List sx={{ flex: 1, overflowY: 'auto', mt: 2 }}>
                {friends.map((friend, index) => (
                    <ListItem key={index} button sx={{ display: 'flex', alignItems: 'center' }}>
                       <Avatar src={friend.profile} sx={{ mr: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography color={"white"} sx={{ fontSize: "15px" }}>
                                {friend.nick}
                            </Typography>
                            <Typography color={"white"} variant="caption">
                                {friend.status}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
            
            {/* 하단 버튼들 */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    sx={{ flexGrow: 1, mr: 1, bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#388E3C' } }}
                    onClick={() => setInviteModalOpen(true)}
                >
                    그룹초대
                </Button>
                <Button
                    variant="contained"
                    startIcon={<VideoCall />}
                    sx={{ flexGrow: 1, bgcolor: '#0288D1', color: 'white', '&:hover': { bgcolor: '#0277BD' } }}
                    onClick={handleVideoCall}
                >
                    화상회의
                </Button>
            </Box>

            <InviteModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        </Box>
    );
}

export default RoomSideBar;
