// src/api/roomService.js
import apiClient from './apiClient';

const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await apiClient.get('/rooms');
    return response.data;
  },

  // Get room by ID
  getRoomById: async (roomId) => {
    const response = await apiClient.get(`/rooms/${roomId}`);
    return response.data;
  },

  // Get available rooms for a time slot
  getAvailableRooms: async (startTime, endTime, capacity = null) => {
    let url = `/rooms/available?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
    
    if (capacity) {
      url += `&capacity=${capacity}`;
    }
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get room availability for a specific date
  getRoomAvailability: async (roomId, date) => {
    const formattedDate = date instanceof Date ? date.toISOString() : date;
    const response = await apiClient.get(`/rooms/${roomId}/availability?date=${encodeURIComponent(formattedDate)}`);
    return response.data;
  }
};

export default roomService;