// components/notification/FriendNotificationListener.js
import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Badge, IconButton, Typography } from '@mui/material';
import { useMember } from '../../contexts/MemberContext';
import { useNavigate } from 'react-router-dom';
import { useFriendNotification } from '../../contexts/FriendNotificationContext';


const FriendNotificationListener = () => {
    const { friendBadgeCount, incrementFriendBadgeCount, resetFriendBadgeCount } = useFriendNotification();
    const [anchorEl, setAnchorEl] = useState(null);
    const socketUrl = process.env.REACT_APP_SOCAT_URL; // WebSocket 엔드포인트 URL
    const { meId } = useMember();
   
    const navigate = useNavigate();

    useEffect(() => {
        const socketFactory = () => new SockJS(socketUrl);
        const stompClient = Stomp.over(socketFactory);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/queue/notification/friend/${meId}`, () => {
                incrementFriendBadgeCount(); // 친구 초대 요청 카운트 증가
                console.log("친구 초대 요청이 왔습니다");
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [meId, incrementFriendBadgeCount]);

    const handleIconClick = (event) => {
        setAnchorEl(event.currentTarget);
        resetFriendBadgeCount(); // 알림을 확인하면 친구 초대 배지 카운트를 초기화
        navigate('/friend/wait'); // 친구 대기 목록으로 이동
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
                onClick={handleIconClick}
            >
                <Badge badgeContent={friendBadgeCount} color="error">
                    <Typography color="inherit">
                        친구 대기
                    </Typography>
                </Badge>
            </IconButton>
        </div>
    );
};

export default FriendNotificationListener;
