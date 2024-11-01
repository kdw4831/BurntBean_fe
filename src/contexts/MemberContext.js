import React, { createContext, useContext, useState, useEffect } from 'react';

// MemberContext 생성
const MemberContext = createContext();

// MemberContext를 제공하는 Provider 컴포넌트
export const MemberProvider = ({ children }) => {
    const [meId, setMeId] = useState(() => {
        const savedId = localStorage.getItem('meId');
        try {
            return savedId ? JSON.parse(savedId) : null;
        } catch (e) {
            console.error("Invalid JSON for id:", savedId);
            return null;
        }
    });
    
    const [nick, setNick] = useState(() => {
        const savedNick = localStorage.getItem('nick');
        try {
            return savedNick ? JSON.parse(savedNick) : '';
        } catch (e) {
            console.error("Invalid JSON for nick:", savedNick);
            return '';
        }
    });
    
    const [name, setName] = useState(() => {
        const savedName = localStorage.getItem('name');
        try {
            return savedName ? JSON.parse(savedName) : '';
        } catch (e) {
            console.error("Invalid JSON for name:", savedName);
            return '';
        }
    });
    

    // 상태값이 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('meId', JSON.stringify(meId));
    }, [meId]);

    useEffect(() => {
        localStorage.setItem('nick', JSON.stringify(nick));
    }, [nick]);

    useEffect(() => {
        localStorage.setItem('name', JSON.stringify(name));
    }, [name]);

    return (
        <MemberContext.Provider value={{ meId, setMeId, nick, setNick, name, setName }}>
            {children}
        </MemberContext.Provider>
    );
};

// MemberContext를 쉽게 사용하기 위한 커스텀 훅
export const useMember = () => useContext(MemberContext);
