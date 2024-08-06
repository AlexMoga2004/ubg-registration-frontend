import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for user authentication
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    console.log("UserProvider - isAuthenticated:", isAuthenticated);
    console.log("UserProvider - user:", user);
  }, [isAuthenticated, user]);

  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
