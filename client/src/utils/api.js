import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/todos`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoAPI = {
  getAll: (params) => api.get("/", { params }),
  getStats: () => api.get("/stats"),
  getById: (id) => api.get(`/${id}`),
  create: (data) => api.post("/", data),
  update: (id, data) => api.put(`/${id}`, data),
  toggle: (id) => api.patch(`/${id}/toggle`),
  delete: (id) => api.delete(`/${id}`),
  clearCompleted: () => api.delete("/"),
};

export default api;
