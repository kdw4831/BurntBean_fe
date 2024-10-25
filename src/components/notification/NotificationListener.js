// components/notification/NotificationListener.js
import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Badge, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useMember } from '../../contexts/MemberContext';

const NotificationListener = () => {
    const [notifications, setNotifications] = useState([]);
    const [badgeCount, setBadgeCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const socketUrl = 'http://localhost:9000/ws'; // WebSocket 엔드포인트 URL
    const { id, nick, name } = useMember();
    let myId= id    

    useEffect(() => {
        const socketFactory = () => new SockJS(socketUrl);
        const stompClient = Stomp.over(socketFactory);
    
        stompClient.connect({}, () => {
            console.log("초대 웹소켓 연결됨");
            stompClient.subscribe(`/queue/notification/${myId}`, (message) => {
                setNotifications(prev => [...prev, message.body]);
                setBadgeCount(prev => prev + 1); // 알림 수 증가
                console.log("초대 요청이 와습니다");
            });
        });
    
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [myId]);

    const handleIconClick = (event) => {
        setAnchorEl(event.currentTarget);
        setBadgeCount(0); // 알림을 확인하면 카운트를 초기화
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id2 = open ? 'notification-popover' : undefined;

    return (
        <div>
            <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={handleIconClick}>
                <Badge badgeContent={badgeCount} color="error">
                    < NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id2}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List>
                    {notifications.map((notification, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={notification} />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </div>
    );
};

export default NotificationListener;
