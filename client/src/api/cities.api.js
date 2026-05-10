import api from './axiosInstance';

export const citiesApi = {
  search: (q, region) => api.get('/cities', { params: { q, region } }),
  getActivities: (cityId, filters = {}) =>
    api.get(`/cities/${cityId}/activities`, { params: filters }),
};
