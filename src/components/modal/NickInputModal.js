import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { axiosClient } from '../../utils/axiosClient';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useMember } from '../../contexts/MemberContext';

const NickInputModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [completionModal, setCompletionModal] = useState(false); // 완료 모달 상태 추가
  const [nick, setNickname] = useState('');
  const [birth, setBirthdate] = useState(dayjs());
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null); // null로 초기화
  const { setMeId, setNick, setName } = useMember(); // MemberContext의 setter 함수를 가져옴


  const handleModalSubmit = async () => {
    try {
      await axiosClient.post('/member/update', {
        nick,
        birth: birth.format('YYYY-MM-DD'),
      });
      setShowModal(false);
      setNickname('');
      setBirthdate(dayjs());
      setCompletionModal(true); // 제출 성공 시 완료 모달 띄우기
  
      // 로그인 성공 후 사용자 정보를 가져옴
      const memberData = await axiosClient.get('/member/get_me');
      const { id, nick: fetchedNick, name } = memberData.data; // 변수명 충돌 방지
  
      setMeId(id);
      setNick(fetchedNick);
      setName(name);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

  const checkNicknameAvailability = async () => {
    try {
      const response = await axiosClient.get(`/member/nick?nick=${nick}`);
      setIsNicknameAvailable(!response.data);
    } catch (error) {
      console.error('Error checking nickname:', error);
    }
  };

  useEffect(() => {
    axiosClient.setShowModalHandler(setShowModal);
  }, []);

  return (
    <div>
      <Dialog open={showModal}>
        <DialogTitle>필수 입력사항입니다!</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            닉네임과 생년월일을 입력하세요.
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <TextField
              autoFocus
              margin="dense"
              label="닉네임"
              type="text"
              fullWidth
              variant="outlined"
              value={nick}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameAvailable(null); // 닉네임 변경 시 상태 초기화
              }}
              error={isNicknameAvailable === false} // 닉네임 중복 시 오류 표시
              helperText={
                isNicknameAvailable === false
                  ? '이미 사용 중인 닉네임입니다.'
                  : isNicknameAvailable === true
                  ? '사용 가능한 닉네임입니다.'
                  : ''
              }
            />
            <Button
              onClick={checkNicknameAvailability}
              variant="outlined"
              size="medium"
              style={{ marginLeft: '8px' }}
            >
              확인
            </Button>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="생년월일"
                value={birth}
                onChange={(newValue) => setBirthdate(newValue)}
                views={['year', 'month', 'day']}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalSubmit}
            disabled={isNicknameAvailable !== true} // 닉네임이 유효하지 않으면 비활성화
          >
            제출
          </Button>
        </DialogActions>
      </Dialog>

      {/* 완료 모달 */}
      <Dialog open={completionModal} onClose={() => setCompletionModal(false)}>
        <DialogTitle>완료!</DialogTitle>
        <DialogContent>
          <Typography>화상콩에 오신 것을 환영합니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletionModal(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NickInputModal;
