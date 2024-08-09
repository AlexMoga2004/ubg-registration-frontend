import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useUser } from "./../global/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar = ({ loginMode: isLoggedIn }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { setIsAuthenticated, setUser } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { user } = useUser();

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
      setUnreadMessageCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadMessageCount();
    }
  }, [user]);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleNotificationClose();
    handleMenuClose(); // Ensure the user menu also closes
    navigate("/login");
  };

  const handleNotificationRedirect = () => {
    handleNotificationClose(); // Close the notification popover
    if (unreadMessageCount > 0) {
      navigate("/messages"); // Redirect to messages tab
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
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
                    padding: "2px 4px", // Smaller padding
                    fontSize: "10px", // Smaller font size
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
                  cursor: "pointer", // Make cursor a pointer to indicate it's clickable
                  bgcolor: colors.primary[300], // Light background color to stand out
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: colors.primary[400], // Darker background on hover
                    color: colors.grey[100], // Change text color on hover
                  },
                }}
                onClick={handleNotificationRedirect}
              >
                {unreadMessageCount === 0
                  ? "No notifications"
                  : `You have ${unreadMessageCount} unread message(s). Click to view.`}
              </Typography>
            </Popover>

            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
