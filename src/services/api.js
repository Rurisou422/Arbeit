import axios from 'axios';

// Determine the base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';
// For production, we use Netlify functions
// For development, we still use the Express server
const API_URL = isProduction 
  ? '/.netlify/functions' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for adding auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't tried to retry the request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Token expired or invalid, log user out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optional: reload page or redirect to login page
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api; 