import { apiRequest } from "../utils/fetch";
export const UserServices = {
  getAll: () => apiRequest('/user'),
  getById: (id) => apiRequest(`/user/${id}`),
  create: (data) => apiRequest('/user', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/user/${id}`, { method: 'PUT', body: data }),
};