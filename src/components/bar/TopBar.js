import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../../contexts/GroupContext';
import { useMember } from '../../contexts/MemberContext';
import GroupNotificationListener from '../notification/GroupNotificationListener';
import FriendNotificationListener from '../notification/FriendNotificationListener';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function TopBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isClicked, setIsClicked] = React.useState(false);
  const [messageCount, setMessageCount] = useState(0); // 메시지 개수 상태
  const [alertOpen, setAlertOpen] = useState(false); // 알림 상태

  const { groupName, rtype, members } = useGroup();
  const { nick } = useMember();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    if (getTopBarTitle() === "화상콩") {
      navigate('/'); // "화상콩"일 때만 루트 경로로 이동
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  const handleMailIconClick = () => {
    if (messageCount === 0) {
      setAlertOpen(true); // 메시지가 없으면 알림 열기
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false); // 알림 닫기
  };

  const getTopBarTitle = () => {
    if (location.pathname === "/" || location.pathname === "/group/wait" || location.pathname === "/friend/wait") return "화상콩";
    if (rtype === "group") {
      return groupName || "그룹 채팅";
    } else if (rtype === "dm") {
      const friend = members?.find((member) => member.nick !== nick);
      return friend ? friend.nick : "1:1 채팅";
    }
    return "화상콩";
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{nick}님 환영해요!</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMailIconClick}>
        <IconButton size="large" aria-label="show new mails" color="inherit">
          <Badge badgeContent={messageCount} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#3C3D37" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={handleClick}
            sx={{
              display: { xs: 'none', sm: 'block' },
              cursor: 'pointer',
              color: isClicked ? '#ADD8E6' : 'inherit',
              transition: 'color 0.2s ease',
            }}
          >
            {getTopBarTitle()}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <GroupNotificationListener />
          <FriendNotificationListener />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show new mails" color="inherit" onClick={handleMailIconClick}>
              <Badge badgeContent={messageCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {/* 메시지가 없을 때 알림 표시 */}
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="info" sx={{ width: '100%' }}>
          현재 메시지가 없습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
