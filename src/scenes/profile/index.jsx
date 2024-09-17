import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../theme";
import { useUser } from "../global/UserProvider";
import axios from "axios";

const ProfileModal = ({ closeModal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, setUser, setIsAuthenticated } = useUser();

  const [initialFirstname] = useState(user?.firstname || "");
  const [initialLastname] = useState(user?.lastname || "");
  const [initialEmail] = useState(user?.email || "");

  const [firstname, setFirstname] = useState(initialFirstname);
  const [lastname, setLastname] = useState(initialLastname);
  const [email, setEmail] = useState(initialEmail);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const [isFirstnameEditable, setIsFirstnameEditable] = useState(false);
  const [isLastnameEditable, setIsLastnameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (isPasswordEditable && password !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const userUpdateRequest = {
        originalEmail: user.email,
        firstname: isFirstnameEditable ? firstname : null,
        lastname: isLastnameEditable ? lastname : null,
        email: isEmailEditable ? email : null,
        password: isPasswordEditable ? password : null,
        profilePictureBase64Image: newProfilePicture || null,
      };

      const isAllFieldsNullOrEmpty =
        !userUpdateRequest.firstname &&
        !userUpdateRequest.lastname &&
        !userUpdateRequest.email &&
        !userUpdateRequest.password &&
        !userUpdateRequest.profilePictureBase64Image;

      if (isAllFieldsNullOrEmpty) {
        return;
      }

      const token = localStorage.getItem("token");

      // Make a request to update user info
      await axios.put("http://localhost:8080/auth/update", userUpdateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(false);
      closeModal();
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result.split(",")[1]); // Save only the Base64 string part
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PNG image.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="75vh"
      p={2}
      backgroundColor={colors.primary[400]}
      borderRadius="16px"
      boxShadow={3}
      width="400px"
    >
      <Box display="flex" alignItems="center" mb={3}>
        <img
          src={
            newProfilePicture
              ? `data:image/png;base64,${newProfilePicture}`
              : profilePicture
          }
          alt="Profile"
          width="99"
          height="99"
          style={{ borderRadius: "49%", marginRight: "20px" }}
        />
        <input
          accept="image/png"
          style={{ display: "none" }}
          id="profile-pic-upload"
          type="file"
          onChange={handleProfilePictureUpload}
        />
        <label htmlFor="profile-pic-upload">
          <Button variant="contained" component="span">
            Upload New Profile Picture
          </Button>
        </label>
      </Box>

      {error && (
        <Typography variant="body2" color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* First Name Field */}
      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          label="First Name"
          value={isFirstnameEditable ? firstname : initialFirstname}
          onChange={(e) => setFirstname(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!isFirstnameEditable}
        />
        <Button
          variant="contained"
          onClick={() => {
            setIsFirstnameEditable(!isFirstnameEditable);
            if (!isFirstnameEditable) setFirstname(initialFirstname);
          }}
          sx={{ ml: 1 }}
        >
          {isFirstnameEditable ? "Lock" : "Change"}
        </Button>
      </Box>

      {/* Last Name Field */}
      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          label="Last Name"
          value={isLastnameEditable ? lastname : initialLastname}
          onChange={(e) => setLastname(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!isLastnameEditable}
        />
        <Button
          variant="contained"
          onClick={() => {
            setIsLastnameEditable(!isLastnameEditable);
            if (!isLastnameEditable) setLastname(initialLastname);
          }}
          sx={{ ml: 1 }}
        >
          {isLastnameEditable ? "Lock" : "Change"}
        </Button>
      </Box>

      {/* Email Field */}
      <Box display="flex" alignItems="center">
        <TextField
          variant="outlined"
          label="Email"
          value={isEmailEditable ? email : initialEmail}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          disabled={!isEmailEditable}
        />
        <Button
          variant="contained"
          onClick={() => {
            setIsEmailEditable(!isEmailEditable);
            if (!isEmailEditable) setEmail(initialEmail);
          }}
          sx={{ ml: 1 }}
        >
          {isEmailEditable ? "Lock" : "Change"}
        </Button>
      </Box>

      {/* New Password Field */}
      {isPasswordEditable && (
        <>
          <TextField
            variant="outlined"
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            variant="outlined"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </>
      )}

      {/* Change Password Button */}
      <Button
        onClick={() => setIsPasswordEditable(!isPasswordEditable)}
        variant="contained"
        sx={{ mt: 2 }}
      >
        {isPasswordEditable ? "Lock Password" : "Change Password"}
      </Button>

      {/* Update User Button */}
      <Button
        onClick={handleUpdate}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Update User
      </Button>
    </Box>
  );
};

export default ProfileModal;
