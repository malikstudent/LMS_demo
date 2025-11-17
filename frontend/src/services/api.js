import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
}

export const attendanceAPI = {
  checkin: (classId) => api.post('/attendance/checkin', { class_id: classId }),
  getMyAttendance: () => api.get('/attendance/my'),
}

export const assignmentAPI = {
  listByClass: (classId) => api.get(`/classes/${classId}/assignments`),
  create: (classId, data) => {
    const formData = new FormData()
    formData.append('subject_id', data.subject_id)
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('due_date', data.due_date)
    if (data.file) formData.append('file', data.file)
    return api.post(`/classes/${classId}/assignments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  submit: (assignmentId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  grade: (submissionId, data) => api.post(`/submissions/${submissionId}/grade`, data),
}

export const analyticsAPI = {
  getStudentScores: (studentId) => api.get(`/analytics/student/${studentId}/scores`),
  getClassAttendance: (classId) => api.get(`/analytics/class/${classId}/attendance`),
}

export const announcementAPI = {
  list: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
}

export const adminAPI = {
  // User Management
  listUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Class Management
  listClasses: () => api.get('/admin/classes'),
  createClass: (data) => api.post('/admin/classes', data),
  updateClass: (id, data) => api.put(`/admin/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),
  
  // Subject Management
  listSubjects: () => api.get('/subjects'),
  createSubject: (data) => api.post('/subjects', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
  
  // Reports
  getAttendanceReport: (params) => api.get('/admin/reports/attendance', { params }),
  getGradeReport: (params) => api.get('/admin/reports/grades', { params }),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // CSV Exports
  exportUsers: () => api.get('/admin/export/users', { responseType: 'blob' }),
  exportClasses: () => api.get('/admin/export/classes', { responseType: 'blob' }),
  exportAttendance: (params) => api.get('/admin/export/attendance', { params, responseType: 'blob' }),
  exportGrades: (params) => api.get('/admin/export/grades', { params, responseType: 'blob' }),
}

export default api
