import { AccountCircle, VideoCall, PersonAdd, ArrowBack } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InviteModal from "../group/InviteModal";
import { useGroup } from "../../contexts/GroupContext";
import { axiosClient } from "../../utils/axiosClient";
import { useGroupNotification } from "../../contexts/GroupNotificationContext";

function RoomSideBar() {
    const { groupId, setRtype } = useGroup();
    const [friends, setFriends] = useState([]);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const { invitationCount } = useGroupNotification();
    const {rtype} = useGroup();
 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axiosClient.get(`/room/detail/${groupId}`);
                setFriends(response.data.members);
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoomDetails();
    }, [groupId, invitationCount]);

    const handleVideoCall = () => {
        window.open('/video', '_blank', 'noopener,noreferrer');
    };

    const handleCollapse = () => {
        setRtype(null);
        navigate('/'); // 바로 경로 이동
    };

    return (
        <Box
            sx={{
                width: 300,
                bgcolor: '#3C3D37',
                p: 2,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography color="white" variant="h6" noWrap>
                    방 인원
                </Typography>
                <IconButton onClick={handleCollapse} sx={{ color: 'white' }}>
                    <ArrowBack />
                </IconButton>
            </Box>
            <List sx={{ flex: 1, overflowY: 'auto', mt: 2 }}>
                {friends.map((friend, index) => (
                    <ListItem key={index} button sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={friend.profile} sx={{ mr: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography color="white" sx={{ fontSize: "15px" }}>
                                {friend.nick}
                            </Typography>
                            <Typography color="white" variant="caption">
                                {friend.status}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            {rtype !== 'dm' && (
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    sx={{ flexGrow: 1, mr: 1, bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#388E3C' } }}
                    onClick={() => setInviteModalOpen(true)}
                >
                    그룹초대
                </Button>
           )}
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
