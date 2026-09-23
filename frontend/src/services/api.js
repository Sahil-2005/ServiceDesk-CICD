import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketService = {
  getAll: (params = {}) => api.get('/tickets', { params }),

  getById: (id) => api.get(`/tickets/${id}`),

  create: (ticket) => api.post('/tickets', ticket),

  update: (id, ticket) => api.put(`/tickets/${id}`, ticket),

  updateStatus: (id, status, resolutionNotes) => {
    const payload = { status };
    if (resolutionNotes) {
      payload.resolutionNotes = resolutionNotes;
    }
    return api.patch(`/tickets/${id}/status`, payload);
  },
};

export default api;
