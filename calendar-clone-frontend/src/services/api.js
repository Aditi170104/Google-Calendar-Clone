import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventService = {
  // Get events in a date range
  getEvents: async (start, end) => {
    try {
      const params = start && end ? { start, end } : {};
      const response = await api.get('/events', { 
        params,
        timeout: 3000 // 3 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Return empty array instead of throwing to prevent UI from breaking
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.warn('Backend connection timeout - returning empty events');
        return [];
      }
      // For network errors, return empty array
      if (!error.response) {
        console.warn('Backend not reachable - returning empty events');
        return [];
      }
      throw error;
    }
  },

  // Get single event
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Create event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
};

export default api;

