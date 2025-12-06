import axios from 'axios';

// Use environment variable in production, localhost in development
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

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

// Reports with search and filters
export const getReports = async (filters?: {
  search?: string;
  category?: string;
  status?: string;
  priority?: string;
  isEmergency?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        params.append(key, String(value));
      }
    });
  }
  const { data } = await api.get(`/reports?${params.toString()}`);
  return data;
};

export const createReportMultipart = async (formData: FormData) => {
  const { data } = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

// Increment view count for a report
export const incrementViewCount = async (reportId: string) => {
  const { data } = await api.post(`/reports/${reportId}/view`);
  return data;
};

// Escalate report
export const escalateReport = async (reportId: string, reason: string) => {
  const { data } = await api.post(`/reports/${reportId}/escalate`, { reason });
  return data;
};

// De-escalate report
export const deEscalateReport = async (reportId: string, reason?: string) => {
  const { data } = await api.post(`/reports/${reportId}/de-escalate`, { reason });
  return data;
};

// Update report status
export const updateReportStatus = async (reportId: string, status: string, note?: string) => {
  const { data } = await api.patch(`/reports/${reportId}/status`, { status, note });
  return data;
};

// Get report statistics
export const getReportStats = async () => {
  const { data } = await api.get('/reports/stats');
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

// Notifications
export const getNotifications = async (page = 1, limit = 20, unreadOnly = false) => {
  const { data } = await api.get(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await api.patch('/notifications/read-all');
  return data;
};

export const deleteNotification = async (notificationId: string) => {
  const { data } = await api.delete(`/notifications/${notificationId}`);
  return data;
};

// User settings
export const updateUserLanguage = async (language: string) => {
  const { data } = await api.patch('/profile/language', { language });
  return data;
};

export const updateNotificationSettings = async (settings: {
  statusUpdates?: boolean;
  comments?: boolean;
  likes?: boolean;
  emailNotifications?: boolean;
}) => {
  const { data } = await api.patch('/profile/notification-settings', settings);
  return data;
};

// Get user badges
export const getUserBadges = async (userId?: string) => {
  const { data } = await api.get(userId ? `/profile/${userId}/badges` : '/profile/badges');
  return data;
};

export default api;

