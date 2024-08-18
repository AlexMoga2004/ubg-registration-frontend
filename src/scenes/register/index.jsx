import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  circularProgressClasses,
  colors,
} from "@mui/material";
import React, { useState } from "react";
import { images } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import Animate from "../../components/common/Animate";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [onRequest, setOnRequest] = useState(false);
  const [registerProgress, setRegisterProgress] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    general: "",
  });

  const onRegister = async (e) => {
    e.preventDefault();
    setOnRequest(true);

    // Start the progress animation
    const interval = setInterval(() => {
      setRegisterProgress((prev) => prev + 100 / 40);
    }, 50);

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      clearInterval(interval);
      setRegisterProgress(100);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsRegistered(true);
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      clearInterval(interval);
      setOnRequest(false);
      setRegisterProgress(0);

      if (error.response && error.response.data) {
        const { firstname, lastname, email, password } = error.response.data;
        setFormErrors({
          firstName: firstname || "",
          lastName: lastname || "",
          email: email || "",
          password: password || "",
          general: "",
        });
      } else {
        setFormErrors({
          ...formErrors,
          general: "Network error.",
        });
      }
    }
  };

  const handleLoginClick = () => {
    setAnimateSidebar(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

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

      {/* Register form */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          height: "100%",
          width:
            animateSidebar || isRegistered
              ? "30%"
              : { xl: "40%", lg: "50%", md: "60%", xs: "100%" },
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
              <img src={images.logo} alt="logo" height={150} />
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
            <Animate type="fade" sx={{ maxWidth: 500, width: "100%" }}>
              <Box
                component="form"
                maxWidth={500}
                width="100%"
                onSubmit={onRegister}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <HowToRegOutlinedIcon
                    fontSize="inherit"
                    sx={{ fontSize: 40 }}
                  />{" "}
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={formData.firstName}
                      onChange={handleChange("firstName")}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={formData.lastName}
                      onChange={handleChange("lastName")}
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange("email")}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      value={formData.password}
                      onChange={handleChange("password")}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="success"
                      fullWidth
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
                {formErrors.general && (
                  <Typography
                    variant="body2"
                    color="error"
                    textAlign="center"
                    mt={2}
                  >
                    {formErrors.general}
                  </Typography>
                )}
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
                Already have an account? -{" "}
                <Link to="#" onClick={handleLoginClick}>
                  Sign in
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
                bgcolor: colors.common.white,
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
                  value={registerProgress}
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
      {/* Register form */}
    </Box>
  );
};

export default RegisterPage;
