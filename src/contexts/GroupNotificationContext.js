// contexts/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const GroupNotificationContext = createContext();

export const GroupNotificationProvider = ({ children }) => {
    const [groupBadgeCount, setGroupBadgeCount] = useState(() => {
        const savedCount = localStorage.getItem('groupBadgeCount');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    const [invitationCount, setInvitationCount] = useState(0);

    const incrementGroupBadgeCount = () => {
        setGroupBadgeCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem('groupBadgeCount', newCount);
            return newCount;
        });
    };

    const resetGroupBadgeCount = () => {
        setGroupBadgeCount(0);
        localStorage.setItem('groupBadgeCount', 0);
    };
    
    const invitationAccept = () =>{
        
        {/*카운트를 증가시킴으로써 groupSidebar에서 재랜더링할 때 사용*/}
        setInvitationCount(prev=>prev+1)
     
        
    }

    return (
        <GroupNotificationContext.Provider value={{ groupBadgeCount, incrementGroupBadgeCount, resetGroupBadgeCount ,invitationAccept, invitationCount }}>
            {children}
        </GroupNotificationContext.Provider>
    );
};

export const useGroupNotification = () => useContext(GroupNotificationContext);
