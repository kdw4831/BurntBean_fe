import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import { useMember } from '../contexts/MemberContext';


const GoogleLoginButton = () => {
    const navigate= useNavigate();
    const { setMeId, setNick, setName } = useMember(); // MemberContext의 setter 함수를 가져옴


    const handleSuccess = async (response) => {
        console.log('Login Success:', response);

        try {
            // 서버에 토큰을 전송하여 인증 처리
            const result = await axios.post('http://localhost:9000/api/login/google', {
                idToken: response.credential
                
            }, {
                withCredentials: true // 서버와의 CORS 요청에서 쿠키를 허용
            });
            console.log("jws??", result)
            console.log('Server Response:', result.data);

            // 로그인 성공 후 사용자 정보를 가져옴
            const memberData = await axios.get('http://localhost:9000/api/member/get_me', {
                withCredentials: true
            });

            const { id, nick, name } = memberData.data;
            setMeId(id);
            setNick(nick);
            setName(name);

        console.log('Member Data:', memberData.data);

            navigate('/')
          
        } catch (error) {
            console.error('Error during server request:', error);
        }
    };

    const handleFailure = (error) => {
        console.log('Login Failed:', error);
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
        />
    );
};

export default GoogleLoginButton;
