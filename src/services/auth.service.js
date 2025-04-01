import api from './api';

// Determine if we're using Netlify functions or regular API
const isProduction = process.env.NODE_ENV === 'production';

// Register a new user
export const register = async (userData) => {
  try {
    // For Netlify functions, path is /auth/register
    // For regular API, path is /auth/register
    const path = isProduction ? '/auth/register' : '/auth/register';
    const response = await api.post(path, userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration error' };
  }
};

// User login
export const login = async (credentials) => {
  try {
    // For Netlify functions, path is /auth
    // For regular API, path is /auth/login
    const path = isProduction ? '/auth' : '/auth/login';
    const response = await api.post(path, credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login error' };
  }
};

// User logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Get current user info
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    // For Netlify functions, path is /auth/password
    // For regular API, path is /auth/password
    const path = isProduction ? '/auth/password' : '/auth/password';
    const response = await api.put(path, passwordData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating password' };
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    // For Netlify functions, path is /auth/me
    // For regular API, path is /auth/me
    const path = isProduction ? '/auth/me' : '/auth/me';
    const response = await api.get(path);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching user profile' };
  }
}; 