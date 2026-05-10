
import api from './axiosInstance';

export const notesApi = {
  get: (tripId) => api.get(`/trips/${tripId}/notes`),
  create: (tripId, content) => api.post(`/trips/${tripId}/notes`, { content }),
  update: (tripId, noteId, content) => api.put(`/trips/${tripId}/notes/${noteId}`, { content }),
  delete: (tripId, noteId) => api.delete(`/trips/${tripId}/notes/${noteId}`),
};