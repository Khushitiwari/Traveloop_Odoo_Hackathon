
import api from './axiosInstance';

export const checklistApi = {
  get: (tripId) => api.get(`/trips/${tripId}/checklist`),
  add: (tripId, data) => api.post(`/trips/${tripId}/checklist`, data),
  toggle: (tripId, itemId) => api.patch(`/trips/${tripId}/checklist/${itemId}/toggle`),
  delete: (tripId, itemId) => api.delete(`/trips/${tripId}/checklist/${itemId}`),
};