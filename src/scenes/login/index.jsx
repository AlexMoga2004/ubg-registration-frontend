import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
  circularProgressClasses,
  colors,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React, { useEffect, useState } from "react";
import { images } from "../../assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Animate from "../../components/common/Animate";
import axios from "axios";
import { useUser } from "../global/UserProvider";
import { selectedGridRowsCountSelector } from "@mui/x-data-grid";

const AuthPage = () => {
  const navigate = useNavigate();

  const [onRequest, setOnRequest] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);

  const location = useLocation();
  console.log(localStorage.getItem("skipAnimation"));
  const [openingAnimation, setOpeningAnimation] = useState(
    localStorage.getItem("skipAnimation") !== "true"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isAuthenticated, setIsAuthenticated, setUser } = useUser();

  const onSignin = async (e) => {
    e.preventDefault();
    setOnRequest(true);

    const interval = setInterval(() => {
      setLoginProgress((prev) => prev + 100 / 40);
    }, 50);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email: email,
        password: password,
      });

      clearInterval(interval);
      setLoginProgress(100);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      setIsLoggedIn(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      setOnRequest(false);
      setLoginProgress(0);

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

  const handleRegisterClick = () => {
    setAnimateSidebar(true);
    setTimeout(() => {
      navigate("/register");
    }, 1000);
  };

  useEffect(() => {
    if (isAuthenticated && !isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpeningAnimation(false);
      localStorage.setItem("skipAnimation", "false");
    }, 1500);

    return () => clearTimeout(timer);
  });

  return (
    <Box
      position="relative"
      height="100vh"
      sx={{ "::-webkit-scrollbar": { display: "none" } }}
    >
      {/* background box */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          height: "100%",
          width: "70%",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${images.loginBg})`,
        }}
      />
      {/* background box */}

      {/* Login form */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          height: "100%",
          width: animateSidebar
            ? "40%"
            : isLoggedIn || openingAnimation
            ? "100%"
            : { xl: "30%", lg: "40%", md: "50%", xs: "100%" },
          transition: "all 1s ease-in-out",
          bgcolor: "#FCFCFC",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: animateSidebar ? 0 : 1,
            transition: "all 0.3s ease-in-out",
            height: "100%",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* logo */}
          <Box sx={{ textAlign: "center", p: 5 }}>
            <Animate type="fade" delay={0.5}>
              <img src={images.logo} alt="logo" height={150}></img>
            </Animate>
          </Box>
          {/* logo */}

          {/* form */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Animate type="fade" sx={{ maxWidth: 400, width: "100%" }}>
              <Box
                component="form"
                maxWidth={400}
                width="100%"
                onSubmit={onSignin}
              >
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <LockOutlinedIcon
                      fontSize="inherit"
                      sx={{ fontSize: 40 }}
                    />{" "}
                  </Box>
                  {error && (
                    <Typography
                      variant="body2"
                      color="error"
                      mb={2}
                      textAlign="center"
                      fontSize={15}
                    >
                      {error}
                    </Typography>
                  )}
                  <TextField
                    label="Email Address"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="success"
                  >
                    Sign in
                  </Button>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Remember me"
                      />
                    </FormGroup>
                    <Typography color="error" fontWeight="bold">
                      <Link to="#">Forgot password?</Link>
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Animate>
          </Box>
          {/* form */}

          {/* footer */}
          <Box sx={{ textAlign: "center", p: 5, zIndex: 2 }}>
            <Animate type="fade" delay={1}>
              <Typography
                display="inline"
                fontWeight="bold"
                sx={{ "& > a": { color: colors.red[900], ml: "5px" } }}
              >
                Don't have an account -
                <Link to="#" onClick={handleRegisterClick}>
                  Register now
                </Link>
              </Typography>
            </Animate>
          </Box>
          {/* footer */}

          {/* loading box */}
          {onRequest && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                bgcolor: "#FCFCFC",
                zIndex: 1000,
              }}
            >
              <Box position="relative">
                <CircularProgress
                  variant="determinate"
                  sx={{ color: colors.grey[200] }}
                  size={100}
                  value={100}
                />
                <CircularProgress
                  variant="determinate"
                  disableShrink
                  value={loginProgress}
                  size={100}
                  sx={{
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                    position: "absolute",
                    left: 0,
                    color: colors.green[600],
                  }}
                />
              </Box>
            </Stack>
          )}
          {/* loading box */}
        </Box>
      </Box>
      {/* Login form */}
    </Box>
  );
};

export default AuthPage;
