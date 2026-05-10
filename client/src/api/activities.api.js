import api from './axiosInstance';

export const activitiesApi = {
  addToStop: (tripId, stopId, data) =>
    api.post(`/trips/${tripId}/stops/${stopId}/activities`, data),
  removeFromStop: (tripId, stopId, saId) =>
    api.delete(`/trips/${tripId}/stops/${stopId}/activities/${saId}`),
};