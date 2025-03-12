import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, useScrollTrigger, Menu, MenuItem } from "@mui/material";
import { cloneElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { themeModes } from "../../configs/theme.configs";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { setUser } from "../../redux/features/userSlice";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

const ScrollAppBar = ({ children, window }) => {
  const { themeMode } = useSelector((state) => state.themeMode);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: window ? window() : undefined
  });

  return cloneElement(children, {
    sx: {
      color: trigger ? "text.primary" : themeMode === themeModes.dark ? "primary.contrastText" : "text.primary",
      backgroundColor: themeMode === themeModes.dark ? "background.default" : "background.paper",
    }
  });
};

const Topbar = () => {
  const { user } = useSelector((state) => state.user);
  const { appState } = useSelector((state) => state.appState);
  const { themeMode } = useSelector((state) => state.themeMode);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSwitchTheme = () => {
    const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleUserMenuClose();
  };

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ScrollAppBar>
        <AppBar elevation={0} sx={{ zIndex: 9999, backgroundColor: themeMode === themeModes.dark ? "background.default" : "background.paper" }}>
          <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
            {/* Left Side - Logo & Menu */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton color="inherit" sx={{ mr: 2, display: { md: "none" } }} onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
              <Box>
                <Logo />
              </Box>
            </Stack>

            {/* Centered Navigation Menu */}
            <Box flexGrow={1} alignItems="center" display="flex" justifyContent="center">
              {menuConfigs.main.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    color: appState.includes(item.state) ? "primary.contrastText" : "inherit",
                    mr: 2
                  }}
                  component={Link}
                  to={item.path}
                  variant={appState.includes(item.state) ? "contained" : "text"}
                >
                  {item.display}
                </Button>
              ))}
            </Box>

            {/* Right Side - Theme Toggle & User Menu */}
            <Stack spacing={3} direction="row" alignItems="center">
              <IconButton sx={{ color: "inherit" }} onClick={onSwitchTheme}>
                {themeMode === themeModes.dark ? <DarkModeOutlinedIcon /> : <WbSunnyOutlinedIcon />}
              </IconButton>

              {!user ? (
                <Button variant="contained" onClick={() => dispatch(setAuthModalOpen(true))}>
                  Sign in
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      borderRadius: "20px",
                      backgroundColor: themeMode === themeModes.dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                      px: 2,
                      "&:hover": {
                        backgroundColor: themeMode === themeModes.dark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
                      }
                    }}
                  >
                    {user.username}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem onClick={() => handleNavigation("/favorites")}>Favorites</MenuItem>
                    <MenuItem onClick={() => handleNavigation("/reviews")}>Reviews</MenuItem>
                    <MenuItem onClick={() => handleNavigation("/password-update")}>Update Password</MenuItem>
                    <MenuItem onClick={() => { dispatch(setUser(null)); handleUserMenuClose(); }}>Sign Out</MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  );
};

export default Topbar;
