// NicknameInviteTab.js
import React from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function NicknameInviteTab({ search, onSearchChange, onInvite, filteredNicknames, invitedNicknames }) {
  return (
    <>
      <TextField
        fullWidth
        label="닉네임으로 초대"
        variant="outlined"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onInvite}
        disabled={!search || invitedNicknames.includes(search)}
        sx={{ mb: 2 }}
      >
        초대
      </Button>
      <Box sx={{ mt: 2 }}>
        {filteredNicknames.length > 0 && (
          <List sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
            {filteredNicknames.map((friend, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => onInvite(friend)}>
                    <AddIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={friend.name} />
              </ListItem>
            ))}
          </List>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {invitedNicknames.map((nickname, index) => (
            <Chip key={index} label={nickname} color="primary" />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default NicknameInviteTab;
