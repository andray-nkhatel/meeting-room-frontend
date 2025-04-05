import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7223/api';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Add a response interceptor to handle common errors
  apiClient.interceptors.response.use(
    response => response,
    error => {
      const { status } = error.response || {};
      
      if (status === 401) {
        // If unauthorized, clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
  
  export default apiClient;