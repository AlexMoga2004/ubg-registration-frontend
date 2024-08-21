import React, { useEffect } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import {
  useLocation,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Register from "./scenes/register";
import ProfilePage from "./scenes/profile";
import Enrolpage from "./scenes/enrol";
import MessagesPage from "./scenes/message";
import LoginPage from "./scenes/login";
import { ColorModeContext, useMode } from "./theme";
import axios from "axios";
import { UserProvider, useUser } from "./scenes/global/UserProvider";
import WindowPage from "./scenes/window";
import EnrolPage from "./scenes/enrol";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser(); // Get the authentication state

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// UserNavigator Component
const UserNavigator = () => {
  const { setIsAuthenticated } = useUser();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.get("http://localhost:8080/auth/check-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Token is expired or invalid
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login"; // Redirect to login
          }
        }
      }
    };

    checkTokenValidity();
  }, [setIsAuthenticated]);

  return null; // This component doesn't need to render anything
};

// Main App Component
const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoggedIn = !["/login", "/register"].includes(location.pathname);

  return (
    <UserProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <UserNavigator />
            {isLoggedIn && <Sidebar />}
            <main className="content">
              {isLoggedIn && <Topbar loginMode={isLoggedIn} />}
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                {/* Protect the other routes to require authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/enrol"
                  element={
                    <ProtectedRoute>
                      <EnrolPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/windows"
                  element={
                    <ProtectedRoute>
                      <WindowPage />
                    </ProtectedRoute>
                  }
                />
                {/* Set default page */}
                <Route
                  path="*"
                  element={
                    <>
                      {isLoggedIn && <Navigate to="/dashboard" />}
                      {!isLoggedIn && <Navigate to="/login" />}
                    </>
                  }
                />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserProvider>
  );
};

export default App;
