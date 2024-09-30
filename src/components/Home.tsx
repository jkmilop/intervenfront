import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { path: '/actividad', label: 'Actividad' },
    { path: '/zona', label: 'Zona' },
    { path: '/ciudad', label: 'Ciudad' },
    { path: '/conjunto', label: 'Conjunto' },
    { path: '/empresa', label: 'Empresa' },
    { path: '/global-actividades', label: 'Global Actividades' },
    { path: '/material-construccion', label: 'Material Construcción' },
    { path: '/persona', label: 'Persona' },
    { path: '/proyecto', label: 'Proyecto' },
    { path: '/rol', label: 'Rol' },
    { path: '/tipo-actividad', label: 'Tipo Actividad' },
    { path: '/tipo-estructura', label: 'Tipo Estructura' },
    { path: '/tipo-vivienda', label: 'Tipo Vivienda' },
    { path: '/titulo', label: 'Título' },
    { path: '/tracker-actividades', label: 'Tracker Actividades' },
    { path: '/ubicacion-estructura', label: 'Ubicación Estructura' },
  ];

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            App's Name
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Render Child Components */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the App
        </Typography>
        <Typography variant="body1">
          Use the menu to navigate to different sections.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;