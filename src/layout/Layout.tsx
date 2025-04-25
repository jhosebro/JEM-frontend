import React, { FC, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode, Menu as MenuIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { useNavigate } from "react-router-dom";
import JDL from "../assets/IMG_7619.png"
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";


interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseMenu();
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseMenu();
  };

  const menuItems = [
    { text: "Dashboard", path: "/" },
    { text: "Eventos", path: "/eventos" },
    { text: "Inventario", path: "/inventario" },
  ];

  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            JDL Event Manager App
          </Typography>

          <Tooltip title="Perfil de usuario">
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar src={user?.photoURL || "https://i.pravatar.cc/150"} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 2,
                boxShadow: 3,
                px: 1,
              },
            }}
          >
            <Box sx={{ px: 1.5, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.displayName || "Usuario"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || "correo@ejemplo.com"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={() => handleNavigate("/perfil")}>
              <AccountBoxIcon fontSize="small" sx={{ mr: 1 }} />
              Perfil
            </MenuItem>

            <MenuItem onClick={() => handleNavigate("/configuracion")}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Configuración
            </MenuItem>

            <MenuItem
              disableRipple
              disableTouchRipple
              sx={{ cursor: "default" }}
            >
              <LightMode fontSize="small" sx={{ mr: 1 }} />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                size="small"
                inputProps={{ "aria-label": "Modo oscuro" }}
              />
              <DarkMode fontSize="small" />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Card elevation={0} sx={{ textAlign: "center" }}>
            <CardContent sx={{ backgroundColor: "black" }}>
              <Avatar
                src={JDL}
                sx={{ width: "100%", height: "100%", mx: "auto" }}
              />
            </CardContent>
          </Card>

          <Divider />

          <List>
            {menuItems.map((item, index) => (
              <ListItemButton key={index} LinkComponent="a" href={item.path}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};
