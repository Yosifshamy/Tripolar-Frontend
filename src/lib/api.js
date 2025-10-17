import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || 'https://tripolar-backend-production.up.railway.app/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (name, email, password, signupCode) =>
    api.post('/auth/register', { name, email, password, signupCode }),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  logout: () =>
    api.post('/auth/logout'),
}

// Ushers API calls
export const ushersAPI = {
  getAll: () =>
    api.get('/ushers'),

  getById: (id) =>
    api.get(`/ushers/${id}`),

  updateProfile: (data) =>
    api.put('/ushers/profile', data),

  uploadImage: (formData) =>
    api.post('/ushers/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

// Events API calls
export const eventsAPI = {
  getAll: () =>
    api.get('/events'),

  getById: (id) =>
    api.get(`/events/${id}`),

  create: (formData) =>
    api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, formData) =>
    api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) =>
    api.delete(`/events/${id}`),

  removeImage: (id, imageUrl) =>
    api.delete(`/events/${id}/images`, { data: { imageUrl } }),
}

// Requests API calls
export const requestsAPI = {
  create: (data) =>
    api.post('/requests', data),

  getAll: (params) =>
    api.get('/requests', { params }),

  getById: (id) =>
    api.get(`/requests/${id}`),

  update: (id, data) =>
    api.put(`/requests/${id}`, data),

  delete: (id) =>
    api.delete(`/requests/${id}`),
}

// Admin API calls
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),

  generateCode: () => api.post('/admin/codes/generate'),

  getCodes: () => api.get('/admin/codes'),

  deleteCode: (id) => api.delete(`/admin/codes/${id}`),

  getAllUshers: (params = {}) => api.get('/admin/ushers', { params }),

  updateUsher: (id, data) => api.put(`/admin/ushers/${id}`, data),

  deleteUsher: (id) => api.delete(`/admin/ushers/${id}`),

  toggleUsherVisibility: (id, data) => api.patch(`/admin/ushers/${id}/visibility`, data),

  rejectProfilePicture: (id) => api.delete(`/admin/ushers/${id}/profile-picture`),
}

// Codes API calls
export const codesAPI = {
  verify: (code) =>
    api.post('/codes/verify', { code }),
}

export default api