import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Axios instance with auth token
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reports
export const getReports = async () => {
  const { data } = await api.get('/reports');
  return data;
};

export const createReportMultipart = async (formData: FormData) => {
  const { data } = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

// Engagement
export const toggleLike = async (reportId: string) => {
  const { data } = await api.post(`/reports/${reportId}/like`);
  return data;
};

export const toggleDislike = async (reportId: string) => {
  const { data } = await api.post(`/reports/${reportId}/dislike`);
  return data;
};

export const reportFalse = async (reportId: string) => {
  const { data } = await api.post(`/reports/${reportId}/report-false`);
  return data;
};

export const addComment = async (reportId: string, text: string) => {
  const { data } = await api.post(`/reports/${reportId}/comments`, { text });
  return data;
};

export const getComments = async (reportId: string) => {
  const { data } = await api.get(`/reports/${reportId}/comments`);
  return data;
};

export const deleteComment = async (commentId: string) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// Profile
export const getMyReports = async () => {
  const { data } = await api.get('/profile/my-reports');
  return data;
};

export const deleteReport = async (reportId: string) => {
  const { data } = await api.delete(`/profile/reports/${reportId}`);
  return data;
};
export default api;
