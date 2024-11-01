// contexts/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const FriendNotificationContext = createContext();

export const FriendNotificationProvider = ({ children }) => {
    const [friendBadgeCount, setFriendBadgeCount] = useState(() => {
        const savedCount = localStorage.getItem('friendBadgeCount');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    const [invitationCount, setInvitationCount] = useState(0);

    const incrementFriendBadgeCount = () => {
        setFriendBadgeCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem('friendBadgeCount', newCount);
            return newCount;
        });
    };

    const resetFriendBadgeCount = () => {
        setFriendBadgeCount(0);
        localStorage.setItem('friendBadgeCount', 0);
    };
    
    const invitationAccept = () => {
        // 카운트를 증가시킴으로써 FriendSidebar에서 재렌더링할 때 사용
        setInvitationCount(prev => prev + 1);
    }

    return (
        <FriendNotificationContext.Provider value={{ 
            friendBadgeCount, 
            incrementFriendBadgeCount, 
            resetFriendBadgeCount, 
            invitationAccept, 
            invitationCount 
        }}>
            {children}
        </FriendNotificationContext.Provider>
    );
};

export const useFriendNotification = () => useContext(FriendNotificationContext);
