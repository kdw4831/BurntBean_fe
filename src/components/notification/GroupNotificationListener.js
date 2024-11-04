// components/notification/GroupNotificationListener.js
import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Badge, IconButton, Button, Typography } from '@mui/material';
import { useMember } from '../../contexts/MemberContext';

import { useNavigate } from 'react-router-dom';
import { useGroupNotification } from '../../contexts/GroupNotificationContext';

const GroupNotificationListener = () => {
    const { groupBadgeCount, incrementGroupBadgeCount, resetGroupBadgeCount } = useGroupNotification();
    const [anchorEl, setAnchorEl] = useState(null);
    const socketUrl = process.env.REACT_APP_SOCAT_URL; // WebSocket 엔드포인트 URL
    const { meId } = useMember();
   
    const navigate = useNavigate();

    useEffect(() => {
        const socketFactory = () => new SockJS(socketUrl);
        const stompClient = Stomp.over(socketFactory);

        stompClient.connect({}, () => {
            console.log("그룹 웹소켓");
            console.log('나의 아이디'+ meId)
            stompClient.subscribe(`/queue/notification/${meId}`, () => {
                incrementGroupBadgeCount();
                console.log("그룹 초대요청이 왔습니다");
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [meId,incrementGroupBadgeCount]);

    const handleIconClick = (event) => {
        setAnchorEl(event.currentTarget);
        resetGroupBadgeCount(); // 알림을 확인하면 그룹 초대 배지 카운트를 초기화
        navigate('/group/wait')
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
                <Badge badgeContent={groupBadgeCount} color="error">
                    <Typography color="inherit" >
                        그룹 대기
                    </Typography>
                </Badge>
            </IconButton>
        </div>
    );
};

export default GroupNotificationListener;
