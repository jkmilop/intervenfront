"use client"

import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  Box,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountTree as StructureIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { styled } from "@mui/material/styles"

const drawerWidth = 64

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}))

interface NavBarProps {
  title: string
  children: React.ReactNode
  onLogout: () => void
}

const NavBar: React.FC<NavBarProps> = ({ title, children, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
          ml: `${drawerOpen ? drawerWidth : 0}px`,
          bgcolor: "#1976d2",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton color="inherit">
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Box>
          <Toolbar />
          <List>
            <Tooltip title="Proyectos" placement="right">
              <ListItemButton
                sx={{ display: "flex", justifyContent: "center", py: 2 }}
                onClick={() => handleNavigation("/proyectos")}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <DashboardIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
           {/* <Tooltip title="Estructuras" placement="right">
              <ListItemButton
                sx={{ display: "flex", justifyContent: "center", py: 2 }}
                onClick={() => handleNavigation("/estructuras")}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <StructureIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>*/}
          </List>
        </Box>
        {/* Botón de Cerrar sesión en la parte inferior */}
        <Box>
          <List>
            <Tooltip title="Cerrar sesión" placement="right">
              <ListItemButton
                sx={{ display: "flex", justifyContent: "center", py: 2 }}
                onClick={onLogout}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <LogoutIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Main>
    </Box>
  )
}

export default NavBar