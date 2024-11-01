import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Box, TextField, Button, List, ListItem, Typography, Paper } from "@mui/material";
import { axiosClient } from "../../utils/axiosClient";
import { useGroup } from "../../contexts/GroupContext";
import { useMember } from "../../contexts/MemberContext";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const { nick } = useMember();
  const { groupId } = useGroup();
  let roomId = groupId;

  const fetchMessages = async () => {
    try {
      const res = await axiosClient.get(`/message/${roomId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const socket = new SockJS("http://localhost:9000/ws");
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      stomp.subscribe(`/room/${roomId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });

    setStompClient(stomp);

    return () => {
      stomp.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      stompClient.send(`/send/${roomId}`, {}, JSON.stringify({ content: message, nick: nick }));
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 'calc(100vh - 150px)',
        maxHeight: "calc(100vh - 64px)",
        bgcolor: "linear-gradient(to right, #e0eafc, #cfdef3)", // 그라데이션 배경
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ flexGrow: 1, overflowY: "auto", p: 2, bgcolor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="caption" sx={{ color: "#6a6a6a", fontWeight: 600, mb: 0.5 }}>
                {msg.nick} • {msg.createAt}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  padding: "12px 18px",
                  borderRadius: "15px",
                  bgcolor: "#f3f4f6",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                  color: "#333333",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </Typography>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mt: 2,
          bgcolor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요"
          variant="outlined"
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d0d0d0",
              },
              "&:hover fieldset": {
                borderColor: "#b0b0b0",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#007bff",
              },
            },
          }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          sx={{
            ml: 2,
            bgcolor: "#007bff",
            color: "#ffffff",
            fontWeight: "bold",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "10px 20px",
            "&:hover": { bgcolor: "#0056b3" },
          }}
        >
          전송
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
