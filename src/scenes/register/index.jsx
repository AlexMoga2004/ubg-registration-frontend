import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import logo from "../../data/images/logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const RegisterPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for error messages
  const [errors, setErrors] = useState({});

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ ...errors, password: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });

      navigate("/login", {
        state: { message: "User registered successfully" },
      });
    } catch (error) {
      if (error.response) {
        // Clear previous errors
        setErrors({});
        // Set errors based on the response
        setErrors(error.response.data);
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          component="form"
          onSubmit={handleSignup}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.primary[400]}
          p={4}
          borderRadius="16px"
          boxShadow={3}
          width="100%"
          maxWidth="400px"
        >
          <LockOutlinedIcon fontSize="large" color="primary" />
          <Typography variant="h5" mb={2}>
            Signup
          </Typography>
          {errors.general && (
            <Typography color="error" mb={2}>
              {errors.general}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstname"
                label="First Name"
                name="firstname"
                autoComplete="given-name"
                autoFocus
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                error={!!errors.firstname}
                helperText={errors.firstname}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="family-name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                error={!!errors.lastname}
                helperText={errors.lastname}
              />
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password} // You might want to show the same error message
          />
          <Button 
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, borderRadius: "100px" }}
          >
            Sign Up
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default RegisterPage;