import api from './axiosInstance';

export const budgetApi = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`),
  upsert: (tripId, data) => api.put(`/trips/${tripId}/budget`, data),
};