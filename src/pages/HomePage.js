import { Typography, Box, CssBaseline } from '@mui/material';

const HomePage = () => {
  return (
    <Box 
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '83vh',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
      }}
    >
      <CssBaseline />

      {/* 배경 불꽃 효과 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle, rgba(255, 100, 0, 0.2), transparent)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      
      {/* GIF 이미지 배치 */}
      <Box
        component="img"
        src={`${process.env.PUBLIC_URL}/burntbean.gif`}
        alt="Burnt Bean Animation"
        sx={{
          position: 'relative',
          width: '450px',  // 이미지 크기 더 키움
          height: 'auto',
          mb: 2,
          zIndex: 1,
        }}
      />

      {/* 텍스트 콘텐츠 */}
      <Typography 
        variant="h5" 
        sx={{
          color: '#d9534f',  // 불타는 느낌의 색상
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 1,
          mt: 2,
          animation: 'burnText 1.5s infinite alternate',  // 애니메이션 추가
        }}
      >
        오늘도 불타는 중..
      </Typography>

      {/* 텍스트 애니메이션 키프레임 */}
      <style>
        {`
          @keyframes burnText {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default HomePage;
