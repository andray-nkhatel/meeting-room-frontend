// src/api/bookingService.js
import apiClient from './apiClient';

const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get bookings for a specific room
  getBookingsByRoomId: async (roomId) => {
    const response = await apiClient.get(`/bookings/room/${roomId}`);
    return response.data;
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  // Update an existing booking
  updateBooking: async (bookingId, bookingData) => {
    const response = await apiClient.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    await apiClient.delete(`/bookings/${bookingId}`);
    return true;
  },

  // Check if a room is available for a specific time slot
  isRoomAvailable: async (roomId, startTime, endTime) => {
    const formattedStartTime = startTime instanceof Date ? startTime.toISOString() : startTime;
    const formattedEndTime = endTime instanceof Date ? endTime.toISOString() : endTime;
    
    const response = await apiClient.get(
      `/bookings/room/${roomId}/available?startTime=${encodeURIComponent(formattedStartTime)}&endTime=${encodeURIComponent(formattedEndTime)}`
    );
    
    return response.data;
  },

  // New method to get today's meetings
  getTodaysMeetings: async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const response = await apiClient.get(`/bookings/today?date=${today}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s meetings:', error);
      throw error;
    }
  }
};

export default bookingService;