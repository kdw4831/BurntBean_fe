import React, { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const GroupContext = createContext();

// Context를 제공하는 Provider 컴포넌트
export const GroupProvider = ({ children }) => {
    const [id, setId] = useState(() => {
        const savedId = localStorage.getItem('id');
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

    // id, groupName, total이 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('id', JSON.stringify(id));
    }, [id]);

    useEffect(() => {
        localStorage.setItem('groupName', JSON.stringify(groupName));
    }, [groupName]);

    useEffect(() => {
        localStorage.setItem('total', JSON.stringify(total));
    }, [total]);

    return (
        <GroupContext.Provider value={{ id, setId, groupName, setGroupName, total, setTotal }}>
            {children}
        </GroupContext.Provider>
    );
};

// Context를 쉽게 사용하기 위한 커스텀 훅
export const useGroup = () => useContext(GroupContext);
