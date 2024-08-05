import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Login from "./scenes/login";
import Register from "./scenes/register";
import { UserProvider } from "./scenes/global/UserProvider";
// import Enroll from './scenes/enroll';
// import Classes from './scenes/classes';
// import Messages from './scenes/messages';
// import FAQ from './scenes/faq';
// import ManageClasses from './scenes/global/manage_classes';
// import SignupWindows from './scenes/global/signup_windows';

const App = () => {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path='/enroll' element={<Enroll />} /> */}
                {/* <Route path='/classes' element={<Classes />} /> */}
                {/* <Route path='/messages' element={<Messages />} /> */}
                {/* <Route path='/faq' element={<FAQ />} /> */}
                {/* <Route path='/manage_modules' element={<ManageModules />} /> */}
                {/* <Route path='/signup_windows' element={<SignupWindows />} /> */}
                {/* Default to /login */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserProvider>
  );
};

export default App;
