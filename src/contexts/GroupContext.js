import React, { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const GroupContext = createContext();

// Context를 제공하는 Provider 컴포넌트
export const GroupProvider = ({ children }) => {
    const [groupId, setGroupId] = useState(() => {
        const savedId = localStorage.getItem('groupId');
        return savedId ? JSON.parse(savedId) : null;
    });

    const [groupName, setGroupName] = useState(() => {
        const savedGroupName = localStorage.getItem('groupName');
        return savedGroupName ? JSON.parse(savedGroupName) : '';
    });

    const [total, setTotal] = useState(() => {
        const savedTotal = localStorage.getItem('total');
        return savedTotal ? JSON.parse(savedTotal) : 0;
    });

    const [rtype, setRtype] = useState(() => {
        const savedRtype = localStorage.getItem('rtype');
        return savedRtype ? JSON.parse(savedRtype) : 'group'; // 기본값을 'group'으로 설정
    });

    const [members, setMembers] = useState(() => {
        const savedMembers = localStorage.getItem('members');
        return savedMembers ? JSON.parse(savedMembers) : []; // 기본값을 빈 배열로 설정
    });

    // groupId, groupName, total, rtype, members가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('groupId', JSON.stringify(groupId));
    }, [groupId]);

    useEffect(() => {
        localStorage.setItem('groupName', JSON.stringify(groupName));
    }, [groupName]);

    useEffect(() => {
        localStorage.setItem('total', JSON.stringify(total));
    }, [total]);

    useEffect(() => {
        localStorage.setItem('rtype', JSON.stringify(rtype));
    }, [rtype]);

    useEffect(() => {
        localStorage.setItem('members', JSON.stringify(members));
    }, [members]);

    return (
        <GroupContext.Provider value={{ groupId, setGroupId, groupName, setGroupName, total, setTotal, rtype, setRtype, members, setMembers }}>
            {children}
        </GroupContext.Provider>
    );
};

// Context를 쉽게 사용하기 위한 커스텀 훅
export const useGroup = () => useContext(GroupContext);
