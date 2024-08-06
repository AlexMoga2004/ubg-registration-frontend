import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../theme"; // Ensure to import your theme tokens
import { useUser } from "../global/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useUser(); // Access user context

  // Initial values from the user object
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

  // Function to update user information
  const handleUpdate = async () => {
    if (isPasswordEditable && password !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const userUpdateRequest = {
        currentEmail: user.email,
        currentPassword: currentPassword,
        firstname: isFirstnameEditable ? firstname : null,
        lastname: isLastnameEditable ? lastname : null,
        email: isEmailEditable ? email : null,
        password: isPasswordEditable ? password : null,
      };

      // Make a request to update user info
      await axios.put("http://localhost:8080/auth/update", userUpdateRequest);

      // Re-fetch user information using the login API
      console.log(userUpdateRequest.email || userUpdateRequest.currentEmail);
      console.log(
        userUpdateRequest.password || userUpdateRequest.currentPassword
      );
      const loginResponse = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email: userUpdateRequest.email || userUpdateRequest.currentEmail,
          password:
            userUpdateRequest.password || userUpdateRequest.currentEmail,
        }
      );

      const { token, newUser } = loginResponse.data;
      console.log(newUser.firstname);

      // Update user context with the newly fetched user data
      setIsAuthenticated(false);

      // Clear fields
      setFirstname(initialFirstname);
      setLastname(initialLastname);
      setEmail(initialEmail);
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");

      // Reset edit states
      setIsFirstnameEditable(false);
      setIsLastnameEditable(false);
      setIsEmailEditable(false);
      setIsPasswordEditable(false);

      // Navigate back or show success message
      navigate("/dashboard");
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result);
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
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor={colors.primary[400]}
        p={4}
        borderRadius="16px"
        boxShadow={3}
        width="400px" // Set a width for the box
      >
        <Typography variant="h5" mb={2}>
          Profile
        </Typography>
        <Box display="flex" alignItems="center" mb={3}>
          <img
            src={newProfilePicture || profilePicture}
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
              if (!isFirstnameEditable) setFirstname(initialFirstname); // Locking will revert to initial value
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
              if (!isLastnameEditable) setLastname(initialLastname); // Locking will revert to initial value
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
              if (!isEmailEditable) setEmail(initialEmail); // Locking will revert to initial value
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

        {/* Current Password Field (Only at Bottom) */}
        <TextField
          variant="outlined"
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          margin="normal"
        />

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
    </Box>
  );
};

export default ProfilePage;
