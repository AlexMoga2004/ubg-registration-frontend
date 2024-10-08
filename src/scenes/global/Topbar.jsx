import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useUser } from "../global/UserProvider";
import { useNavigate } from "react-router-dom";
import Animate from "../../components/common/Animate";
import axios from "axios";
import ProfileModal from "../profile"; // Import the new ProfileModal component

const Topbar = ({ loginMode: isLoggedIn }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const {
    setIsAuthenticated,
    setUser,
    user,
    unreadMessageCount,
    updateUnreadMessageCount,
  } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Notification dropdown state
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const openNotifications = Boolean(notificationAnchorEl);
  const notificationsId = openNotifications ? "simple-popover" : undefined;

  // User menu state
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (theme.palette.mode === "dark") colorMode.toggleColorMode();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleNotificationClose();
    handleMenuClose();
    navigate("/login");
  };

  const handleNotificationRedirect = () => {
    handleNotificationClose();
    if (unreadMessageCount > 0) {
      navigate("/messages");
    }
  };

  // Fetch unread message count when the component mounts or user changes
  const fetchUnreadMessageCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/messages/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      updateUnreadMessageCount(response.data.count); // Update context state
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadMessageCount();
    }
  }, [user]);

  // Modal state
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Animate type="fade" delay={1}>
        {/* SEARCH BAR */}
        {isLoggedIn && (
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="100px"
          >
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        )}
      </Animate>

      <Animate type="fade" delay={1}>
        {/* Icons */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
          {isLoggedIn && (
            <Box display="flex">
              <IconButton onClick={handleNotificationClick}>
                <NotificationsOutlinedIcon />
                {unreadMessageCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      borderRadius: "50%",
                      color: "white",
                      padding: "2px 4px",
                      fontSize: "10px",
                    }}
                  >
                    {unreadMessageCount}
                  </span>
                )}
              </IconButton>
              <Popover
                id={notificationsId}
                open={openNotifications}
                anchorEl={notificationAnchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Typography
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor: colors.primary[300],
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: colors.primary[400],
                      color: colors.grey[100],
                    },
                  }}
                  onClick={handleNotificationRedirect}
                >
                  {unreadMessageCount === 0
                    ? "No notifications"
                    : `You have ${unreadMessageCount} unread message(s). Click to view.`}
                </Typography>
              </Popover>

              {/* User menu */}
              <IconButton onClick={handleMenuOpen}>
                <PersonOutlinedIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleOpenProfileModal}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Sign out</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Animate>

      {/* Profile Modal */}
      <Dialog open={openProfileModal} onClose={handleCloseProfileModal}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <ProfileModal closeModal={handleCloseProfileModal} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
