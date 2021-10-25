import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Human from "../Icons/Human";

export default function CustomAppBar() {
  return (
    <Box sx={{ flexGrow: 1, position: "relative"}}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#e6d72a" }}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 5 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            <Human />
            🍅 Happy Pose 🍅
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
