import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import logo from "../../data/images/logo.png";
import axios from "axios";
import { useUser } from "./../global/UserProvider"; // Import user context

const LoginPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useUser(); // Access authentication state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      // Optionally, you can store user info if needed
      // setUser(user);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("Network error.");
      }
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
        position="absolute"
        top="20px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "150px", marginBottom: "20px" }}
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor={colors.primary[400]}
        p={4}
        borderRadius="16px"
        boxShadow={3}
      >
        <LockOutlinedIcon fontSize="large" color="primary" />
        <Typography variant="h5" mb={2}>
          Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: <PersonOutlineOutlinedIcon position="start" />,
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: <LockOutlinedIcon position="start" />,
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2, borderRadius: "100px" }}
        >
          Sign In
        </Button>
        <Typography variant="body2">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
