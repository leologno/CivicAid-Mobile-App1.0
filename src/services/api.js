import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URLs
// Updated to use your local machine's IP for physical device testing
const BASE_URL_ANDROID = 'http://192.168.0.6:5000/api/v1';
const BASE_URL_IOS = 'http://192.168.0.6:5000/api/v1';
const BASE_URL_PHYSICAL = 'http://192.168.0.6:5000/api/v1';

const getBaseURL = () => {
  // Check for environment variable first (for production/EAS builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Using physical URL for local testing
  return BASE_URL_PHYSICAL;
};

export const API_URL = getBaseURL();
const BASE_URL = API_URL;

console.log('API Base URL:', BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Complaint APIs
export const complaintAPI = {
  create: (formData) => api.post('/complaints/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadMedia: (complaintId, formData) => api.post(`/complaints/upload-media/${complaintId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUserComplaints: () => api.get('/complaints/user'),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, status, resolutionNotes) => api.put(`/complaints/${id}/status`, { status, resolutionNotes }),
  submitProof: (id, formData) => api.post(`/complaints/${id}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Assignment APIs
export const assignmentAPI = {
  getAssignmentByComplaint: (complaintId) => api.get(`/assignments/complaint/${complaintId}`),
  getMyAssignments: () => api.get('/assignments/my-assignments'),
  reassignComplaint: (complaintId) => api.post(`/assignments/reassign/${complaintId}`),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getComplaints: () => api.get('/admin/complaints'),
  getAnalytics: () => api.get('/admin/analytics'),
  getReports: (params) => api.get('/admin/reports', { params }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;


