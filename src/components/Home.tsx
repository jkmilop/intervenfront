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

  const menuItems = [
    { text: 'Actividad', path: '/actividad' },
    { text: 'Actividades Estructura', path: '/actividades-estructura' },
    { text: 'Capitulo', path: '/capitulo' },
    { text: 'Casas Table', path: '/casas-table' },
    { text: 'Ciudad', path: '/ciudad' },
    { text: 'Conjunto', path: '/conjunto' },
    { text: 'Diseño', path: '/diseno' },
    { text: 'Empresa', path: '/empresa' },
    { text: 'Estructura', path: '/estructura' },
    { text: 'Etapa', path: '/etapa' },
    { text: 'Global Actividades', path: '/global-actividades' },
    { text: 'Estructura Card', path: '/estructura-card' },
    { text: 'Materiales Estructura', path: '/materiales-estructura' },
    { text: 'Persona', path: '/persona' },
    { text: 'Proyecto', path: '/proyecto' },
    { text: 'Reporte', path: '/reporte' },

    { text: 'Rol', path: '/rol' },
    { text: 'Simple Table', path: '/simple-table' },
    { text: 'Tipo Actividad', path: '/tipo-actividad' },
    { text: 'Tipo Estructura', path: '/tipo-estructura' },
    { text: 'Tipo Vivienda', path: '/tipo-vivienda' },
    { text: 'Titulo', path: '/titulo' },
    { text: 'Tracker Actividades', path: '/tracker-actividades' },
    { text: 'Ubicación Estructura', path: '/ubicacion-estructura' },
    { text: 'Zona', path: '/zona' },
    { text: 'Zona Estructura', path: '/zona-estructura' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Construction Management App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box role="presentation" sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Construction Management App
        </Typography>
        <Typography variant="body1">
          Use the menu to navigate to different sections of the application.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;