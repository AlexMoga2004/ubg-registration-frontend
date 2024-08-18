import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import Animate from "../../components/common/Animate";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";

import { useUser } from "./../global/UserProvider";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useUser(); // Get user from context

  const [sidebarColor, setSidebarColor] = useState("#FCFCFC");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSidebarColor(colors.primary[400]);
    }, 0);

    return () => clearTimeout(timeout);
  }, [colors.primary]);

  const profilePic =
    user && user.profilePictureBase64Image
      ? user.profilePictureBase64Image
      : "";

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${sidebarColor} !important`,
          transition: "background-color 500ms ease",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <Animate type="fade" delay={0.5}>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h6" color={colors.grey[100]}>
                    Bahr el Ghazal
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && user && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`data:image/png;base64,${profilePic}`} // Use the Base64 string directly
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {user.firstname + " " + user.lastname}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {user.roles && user.roles.join(", ")}
                  </Typography>
                </Box>
              </Box>
            )}
          </Animate>

          <Animate sx={{ flexGrow: 1 }} delay={0.5}>
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Info
              </Typography>
              <Item
                title="Enroll"
                to="/enroll"
                icon={<SchoolOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Your Classes"
                to="/classes"
                icon={<LibraryBooksOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Messages"
                to="/messages"
                icon={<MessageOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Misc
              </Typography>
              <Item
                title="FAQ"
                to="/faq"
                icon={<ContactSupportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {user && user.roles && user.roles.includes("Admin") && (
                <>
                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Admin
                  </Typography>
                  <Item
                    title="Manage all Modules"
                    to="/manage_modules"
                    icon={<AddOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Signup Windows"
                    to="/signup_windows"
                    icon={<EditCalendarOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              )}
            </Box>
          </Animate>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
