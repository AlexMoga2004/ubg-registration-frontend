import {
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  Badge,
} from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import axios from "axios";
import { useUser } from "./../global/UserProvider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const MessagePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useUser(); // Assuming you have user context
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showMessage, setShowMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/messages/received?page=${currentPage}&size=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentPage]);

  const handleShowMessage = (message) => {
    setShowMessage(message);
  };

  const handleCloseMessage = () => {
    setShowMessage(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="75vh"
      p={2}
      backgroundColor={colors.primary[400]} // Updated background color
    >
      {user?.roles.includes("Admin") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            /* logic to send a message */
          }}
          sx={{ mb: 3, borderRadius: "100px" }}
        >
          Send Message
        </Button>
      )}

      {messages.map((message) => (
        <Box
          key={message.id}
          p={2}
          mb={2}
          borderRadius="8px"
          boxShadow={2}
          width="100%"
          maxWidth="600px"
          backgroundColor={
            message.read ? colors.primary[300] : colors.primary[500]
          } // Lighten up the color for unread messages
          onClick={() => handleShowMessage(message)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: colors.primary[600],
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {`${message.senderFirstName} ${message.senderLastName}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(message.date).toLocaleDateString()}
            </Typography>
            <Badge color="secondary" variant="dot" invisible={message.read} />
          </Box>
          <Typography variant="body2" color="textSecondary">
            {message.senderRoles.join(", ")}
          </Typography>
        </Box>
      ))}

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        width="100%"
        maxWidth="600px"
      >
        <IconButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="body2">
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <IconButton
          onClick={() =>
            setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage + 1 >= totalPages}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {showMessage && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          p={4}
          borderRadius="16px"
          boxShadow={3}
          width="90%"
          maxWidth="500px"
          backgroundColor={colors.primary[400]}
        >
          <Typography variant="h6" mb={2}>
            From:{" "}
            {`${showMessage.senderFirstName} ${showMessage.senderLastName}`}
          </Typography>
          <Typography variant="body2" mb={2}>
            Date: {new Date(showMessage.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" mb={2}>
            {showMessage.messageContent}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseMessage}
            sx={{ mt: 2, borderRadius: "100px" }}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MessagePage;
