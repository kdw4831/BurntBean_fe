import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import { axiosClient } from "../../utils/axiosClient";
import { useParams } from "react-router-dom";
import { useGroup } from "../../contexts/GroupContext";




const ChatRoom = () => {

  const [message, setMessage] = useState("");  // 입력된 메시지 상태
  const [messages, setMessages] = useState([]);  // 수신된 메시지 상태
  const [stompClient, setStompClient] = useState(null);  // STOMP 클라이언트 상태
  const messagesEndRef = useRef(null);  // 스크롤 자동 조정을 위한 Ref
  const {id}=useGroup();
  let roomId=id


  // 방의 메시지 목록을 서버에서 가져오는 함수
  const fetchMessages = async () => {
    try {
      const res = await axiosClient.get(`/message/${roomId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();  // 컴포넌트가 마운트될 때 메시지 목록 가져옴

    // SockJS 및 STOMP 클라이언트 초기화
    const socket = new SockJS("http://localhost:9000/ws");
    const stomp = Stomp.over(socket);

    // STOMP 클라이언트 연결 설정
    stomp.connect({}, () => {
      // 특정 roomId에 대한 구독 설정
      stomp.subscribe(`/room/${roomId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });

    setStompClient(stomp);

    return () => {
      stomp.disconnect();  // 컴포넌트 언마운트 시 연결 해제
    };
  }, [roomId]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      // 서버로 메시지 전송 (/send/{roomId} 경로로 전송)
      stompClient.send(`/send/${roomId}`, {}, JSON.stringify({ content: message }));
      setMessage("");  // 메시지 입력 필드를 초기화
    }
  };

  // 메시지 리스트가 업데이트되면 자동으로 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 'calc(100vh - 150px)', // 전체 높이
        maxHeight: "calc(100vh - 64px)", // 반응형으로 높이 설정
      }}
    >
      {/* 메시지 리스트 */}
     
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",  // 스크롤 설정
          bgcolor: "#f5f5f5",
          p: 2,
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <Typography>{msg.content}</Typography> {/* 메시지 내용 출력 */}
            </ListItem>
          ))}
          {/* 스크롤을 따라가는 요소 */}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* 메시지 입력 필드 및 전송 버튼 */}
      <Box
        sx={{
          display: "flex",
          p: 2,
          bgcolor: "white",
          boxShadow: "0px -1px 5px rgba(0,0,0,0.1)", // 상단에 그림자
        }}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}  // 입력 필드 상태 업데이트
          placeholder="메시지를 입력하세요"
          variant="outlined"
        />
        <Button onClick={sendMessage} variant="contained" sx={{ ml: 2 }}>
          전송
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
