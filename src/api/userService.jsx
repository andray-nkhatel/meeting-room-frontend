// src/api/userService.js
import apiClient from './apiClient';

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await apiClient.get('/usermanagement');
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    const response = await apiClient.get(`/usermanagement/${userId}`);
    return response.data;
  },

  // Promote user to admin (admin only)
  promoteToAdmin: async (userId) => {
    await apiClient.put(`/usermanagement/${userId}/promote`);
    return true;
  },

  // Demote user from admin (admin only)
  demoteFromAdmin: async (userId) => {
    await apiClient.put(`/usermanagement/${userId}/demote`);
    return true;
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    await apiClient.delete(`/usermanagement/${userId}`);
    return true;
  },

  // Update user details (admin only)
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/usermanagement/${userId}`, userData);
    return response.data;
  }
};

export default userService;