import api from './api';

// Determine if we're using Netlify functions or regular API
const isProduction = process.env.NODE_ENV === 'production';

// Get all tickets
export const getAllTickets = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    // Append query string if present
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // Path for Netlify functions or regular API
    const path = isProduction ? '/tickets' : '/tickets';
    const response = await api.get(`${path}${queryString}`);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching tickets' };
  }
};

// Get a single ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}` : `/tickets/${ticketId}`;
    const response = await api.get(path);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching ticket' };
  }
};

// Create a new ticket
export const createTicket = async (ticketData) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? '/tickets' : '/tickets';
    const response = await api.post(path, ticketData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating ticket' };
  }
};

// Update an existing ticket
export const updateTicket = async (ticketId, ticketData) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}` : `/tickets/${ticketId}`;
    const response = await api.put(path, ticketData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating ticket' };
  }
};

// Delete a ticket
export const deleteTicket = async (ticketId) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}` : `/tickets/${ticketId}`;
    const response = await api.delete(path);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting ticket' };
  }
};

// Add a task to a ticket
export const addTask = async (ticketId, taskData) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}/tasks` : `/tickets/${ticketId}/tasks`;
    const response = await api.post(path, taskData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding task' };
  }
};

// Update a task in a ticket
export const updateTask = async (ticketId, taskId, taskData) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}/tasks/${taskId}` : `/tickets/${ticketId}/tasks/${taskId}`;
    const response = await api.put(path, taskData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating task' };
  }
};

// Delete a task from a ticket
export const deleteTask = async (ticketId, taskId) => {
  try {
    // Path for Netlify functions or regular API
    const path = isProduction ? `/tickets/${ticketId}/tasks/${taskId}` : `/tickets/${ticketId}/tasks/${taskId}`;
    const response = await api.delete(path);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting task' };
  }
}; 