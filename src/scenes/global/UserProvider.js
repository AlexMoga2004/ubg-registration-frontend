import React, { createContext, useContext, useState } from "react";

// Create a context for user authentication
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Optionally store user info

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
