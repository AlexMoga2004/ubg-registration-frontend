import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Login from "./scenes/login";
import Register from "./scenes/register";
import ProfilePage from "./scenes/profile";
import { UserProvider, useUser } from "./scenes/global/UserProvider";
import MessagesPage from "./scenes/message";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser(); // Get the authentication state

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoggedIn = !["/", "/login", "/register"].includes(location.pathname);

  return (
    <UserProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {isLoggedIn && <Sidebar />}
            <main className="content">
              <Topbar loginMode={isLoggedIn} />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protect the outher ProtectedRoute to require authentication*/}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
