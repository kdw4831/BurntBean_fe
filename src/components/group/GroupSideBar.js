import { AddCircleOutline } from "@mui/icons-material";
import { Avatar, Box, IconButton, List, ListItem, Modal, Tooltip, Typography, Button, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { axiosClient } from "../../utils/axiosClient";
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import { useGroup } from "../../contexts/GroupContext";

function GroupSideBar() {
    const [groupList, setGroupList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const navigate = useNavigate(); 
    const { setId, setGroupName, setTotal } = useGroup(); 

    // 그룹 데이터를 가져오는 함수
    const fetchGroups = async () => {
        try {
            const res = await axiosClient.get("/room/list/group");
            setGroupList(res.data); // 서버로부터 데이터를 받아와서 state에 저장
        } catch (error) {
            console.error("Error fetching group data:", error);
            setGroupList([]); // 에러 발생 시 빈 배열로 설정
        }
    };

    useEffect(() => {
        fetchGroups(); // 컴포넌트가 처음 렌더링될 때 그룹 데이터를 가져옴
    }, []);

    // 그룹 추가 모달 열기/닫기 핸들러
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // 새로운 그룹 생성 함수
    const handleCreateGroup = async () => {
        try {
            const res = await axiosClient.post("/room/create", { groupName: newGroupName });
            fetchGroups(); // 새로운 그룹을 생성 후 다시 그룹 목록을 가져옴
            setNewGroupName(""); // 입력 필드를 초기화
            handleCloseModal(); // 모달 닫기
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    // 그룹 avatar 클릭 핸들러
    const handleGroupClick = async(groupId) => {
        const res= await axiosClient.get(`/room/detail/${groupId}`)
        setId(res.data.id)
        setGroupName(res.data.groupName)
        setTotal(res.data.total)
        navigate(`/chat`); // 그룹 ID를 포함하여 ChatRoom으로 이동
    };

    return (
        <Box sx={{ width: 100, bgcolor: '#697565', p: 2 , height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h6" color={"white"} noWrap>
                Room
            </Typography>
            <List sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                {Array.isArray(groupList) && groupList.length > 0 ? (
                    groupList.map((group) => (
                        <ListItem
                            key={group.id} // 고유한 ID 사용
                            button
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    bgcolor: '#e0e0e0', // 호버 시 배경색 변화
                                },
                            }}
                            onClick={() => handleGroupClick(group.id)} // 클릭 시 그룹 ID를 전달
                        >
                            <Tooltip title={group.groupName} arrow>
                                <Avatar sx={{ bgcolor: grey[500] }}>{group.groupName[0]}</Avatar>
                            </Tooltip>
                            <Typography variant="caption" color={"white"} noWrap>
                                {group.groupName}
                            </Typography>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="caption" color={"white"}>
                        그룹을<br/>
                        만들어봐요!
                    </Typography>
                )}
                <ListItem
                    button
                    sx={{ justifyContent: 'center', mt: 'auto', display: 'flex', flexDirection: 'column' }}
                    onClick={handleOpenModal} // 버튼 클릭 시 모달 열기
                >
                    <Tooltip title={"그룹 추가"} arrow>
                        <IconButton>
                            <AddCircleOutline sx={{ fontSize: 40 }} />
                        </IconButton>
                    </Tooltip>
                </ListItem>
            </List>

            {/* 그룹 생성 모달 */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6" mb={2}>
                        그룹 만들기
                    </Typography>
                    <TextField
                        fullWidth
                        label="그룹 이름"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        variant="outlined"
                        mb={2}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" onClick={handleCreateGroup} disabled={!newGroupName}>
                            생성하기
                        </Button>
                        <Button onClick={handleCloseModal} sx={{ ml: 2 }}>
                            취소
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default GroupSideBar;
