
import api from './axiosInstance';

export const stopsApi = {
  add: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  update: (tripId, stopId, data) => api.put(`/trips/${tripId}/stops/${stopId}`, data),
  delete: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
};