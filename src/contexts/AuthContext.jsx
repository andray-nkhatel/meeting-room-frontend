// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '../api/auth';


// Create the context
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Change this to be a named export instead of default export
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on component mount
    const user = auth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    auth.logout();
    setCurrentUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser && currentUser.isAdmin;
  };

  const value = {
    currentUser,
    isAdmin,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Make AuthProvider the default export
export default AuthProvider;