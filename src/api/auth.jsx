// src/api/auth.js
import apiClient from './apiClient';

const auth = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  // login: async (credentials) => {
  //   const response = await apiClient.post('/auth/login', credentials);
  //   if (response.data.token) {
  //     localStorage.setItem('token', response.data.token);
  //     localStorage.setItem('user', JSON.stringify(response.data.user));
  //   }
  //   return response.data;
  // },


 // In auth.js
login: async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data && response.data.token) {
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Store user data - this structure should match what getCurrentUser returns
      const userData = {
        userId: response.data.userId,
        username: response.data.username,
        fullName: response.data.fullName,
        isAdmin: response.data.isAdmin
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Add user to response for convenience
      response.data.user = userData;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
},
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current authenticated user
  getCurrentUser: () => {
    try {
      // Get the user string from localStorage
      const userStr = localStorage.getItem('user');
      
      // Check if it's null or undefined
      if (userStr === null || userStr === undefined || userStr === 'undefined') {
        console.log('No user found in localStorage');
        return null;
      }
      
      // Try to parse the JSON
      try {
        return JSON.parse(userStr);
      } catch (parseError) {
        console.error('Error parsing user JSON:', parseError);
        // Clean up invalid data
        localStorage.removeItem('user');
        return null;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },

  

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = auth.getCurrentUser();
    return user && user.isAdmin;
  }
};

export default auth;