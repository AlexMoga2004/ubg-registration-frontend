import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Modal,
  TextField,
  Autocomplete,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./../global/UserProvider";
import Animate from "../../components/common/Animate";

const MessagesPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user, isAuthenticated } = useUser(); // Get current user's information
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [senders, setSenders] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.roles) {
      fetchMessages();
      if (user.roles.includes("Admin")) {
        fetchUsers();
      }
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, page, rowsPerPage, navigate, user]);

  useEffect(() => {
    if (isAuthenticated && user?.roles) {
      fetchMessages();
      if (user.roles.includes("Admin")) {
        fetchUsers();
        fetchRoles(); // Fetch roles when the user is an Admin
      }
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, page, rowsPerPage, navigate, user]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/messages/received?page=${page}&size=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(response.data.content);

      // Fetch sender details for each message
      const senderIds = response.data.content.map(
        (message) => message.senderID
      );
      fetchSenders(senderIds);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchSenders = async (senderIds) => {
    const senderPromises = senderIds.map((senderId) =>
      axios.get(`http://localhost:8080/auth/users/${senderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
    );

    try {
      const senderResponses = await Promise.all(senderPromises);
      const senderData = senderResponses.reduce((acc, response) => {
        const sender = response.data;
        acc[sender.id] = sender; // Map sender's ID to sender's details
        return acc;
      }, {});
      setSenders(senderData);
    } catch (error) {
      console.error("Error fetching senders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/auth/users?searchTerm=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/auth/unique-roles`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSendMessage = async () => {
    if (selectedUser && messageContent && messageSubject) {
      const message = {
        senderID: user.id,
        recipientID: selectedUser.id,
        date: undefined,
        messageSubject: messageSubject,
        messageContent: messageContent,
        read: false,
      };

      // If a role is selected, send the message to all users with that role
      if (selectedUser.isRole) {
        const usersWithRole = users.filter((u) =>
          u.roles.includes(selectedUser.role)
        );
        for (const userWithRole of usersWithRole) {
          await axios.post(
            `http://localhost:8080/messages`,
            {
              ...message,
              recipientID: userWithRole.id, // Send to each user with the role
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
      } else {
        try {
          await axios.post(`http://localhost:8080/messages`, message, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }

      setMessageContent("");
      setMessageSubject("");
      setSelectedUser(null);
      setOpenModal(false);
      fetchMessages();
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(
        `http://localhost:8080/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchMessages(); // Refresh messages after marking as read
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const viewMessageDetails = (message) => {
    setSelectedMessage(message);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedMessage(null);
  };

  return (
    <Box p={3}>
      <Animate sx={{ flexGrow: 1 }} delay={0}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        {user?.roles?.includes("Admin") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenModal(true)}
            sx={{ mb: 2 }}
          >
            Send Message
          </Button>
        )}
      </Animate>

      {/* Message Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="send-message-modal"
        aria-describedby="send-message-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: colors.primary[400],
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography id="send-message-modal" variant="h6" component="h2">
            Send Message
          </Typography>
          <Autocomplete
            options={[
              ...users,
              ...roles.map((role) => ({ role, isRole: true })),
            ]}
            getOptionLabel={(option) =>
              option.isRole
                ? option.role
                : `${option.firstname} ${option.lastname} (${option.roles.join(
                    ", "
                  )})`
            }
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
              fetchUsers();
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                // Check if selected value is a role
                if (newValue.isRole) {
                  setSelectedUser({ ...newValue, id: null }); // Set as a role
                } else {
                  setSelectedUser(newValue);
                }
              }
            }}
            renderOption={(props, option) => (
              <Box {...props} display="flex" alignItems="center">
                {!option.isRole && (
                  <img
                    src={`data:image/png;base64,${option.profilePictureBase64Image}`}
                    alt={`${option.firstname} ${option.lastname}`}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                )}
                <Box>
                  <Typography variant="body1">
                    {option.isRole
                      ? option.role
                      : `${option.firstname} ${option.lastname}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {!option.isRole && option.roles.join(", ")}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search User or Role"
                variant="outlined"
              />
            )}
            filterOptions={(options, { inputValue }) =>
              options.filter((option) =>
                `${option.firstname || option.role}`
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              )
            }
          />
          <TextField
            fullWidth
            label="Message Subject"
            variant="outlined"
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            inputProps={{ maxLength: 45 }} // Max length for subject
          />
          <TextField
            fullWidth
            label="Message Content"
            variant="outlined"
            multiline
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!messageContent || !messageSubject}
            >
              Send
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenModal(false)}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Message Details Modal */}
      <Modal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        aria-labelledby="message-details-modal"
        aria-describedby="message-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: colors.primary[400],
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: "auto", // Enable vertical scrolling
            maxHeight: "80vh", // Limit height of modal
          }}
        >
          <Typography id="message-details-modal" variant="h6" component="h2">
            Message Details
          </Typography>
          {selectedMessage && (
            <Box>
              {/* Fetch sender's name using senders state */}
              {senders[selectedMessage.senderID] ? (
                <>
                  <Typography variant="body1">
                    <strong>Sender:</strong>{" "}
                    {senders[selectedMessage.senderID].firstname}{" "}
                    {senders[selectedMessage.senderID].lastname}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedMessage.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Subject:</strong> {selectedMessage.messageSubject}{" "}
                    {/* Display subject */}
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: `1px solid ${colors.grey[500]}`,
                      borderRadius: 1,
                      p: 1,
                      mt: 1,
                      bgcolor: colors.primary[400],
                    }}
                  >
                    <Typography variant="body1">
                      {selectedMessage.messageContent}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1">
                  <strong>Sender:</strong> Loading...
                </Typography>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  markAsRead(selectedMessage.id);
                  handleCloseDetailModal();
                }}
                sx={{ mt: 2 }}
              >
                Mark as Read
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseDetailModal}
                sx={{ mt: 2, ml: 1 }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Messages Table */}
      <Animate sx={{ flexGrow: 1 }} delay={0.2}>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Roles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  onClick={() => viewMessageDetails(message)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: colors.primary[300],
                    "&:hover": { backgroundColor: colors.primary[400] },
                  }}
                >
                  <TableCell>
                    {senders[message.senderID]?.firstname}{" "}
                    {senders[message.senderID]?.lastname}
                  </TableCell>
                  <TableCell>{message.messageSubject}</TableCell>
                  <TableCell>
                    {new Date(message.date).toLocaleString()}
                  </TableCell>
                  <TableCell>{message.read ? "Read" : "Unread"}</TableCell>{" "}
                  {/* Add read status */}
                  <TableCell>
                    {senders[message.senderID]?.roles.join(", ")}{" "}
                    {/* Display user roles */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={messages.length} // Update count to match total messages
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Animate>
    </Box>
  );
};

export default MessagesPage;
