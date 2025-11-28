import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData)
};

// Teachers
export const teacherService = {
  getAll: () => api.get('/teacher'),
  create: (teacher) => api.post('/teacher', teacher)
};

// Courses
export const courseService = {
  getAll: () => api.get('/course'),
  create: (course) => api.post('/course', course),
  update: (id, course) => api.put(`/course/${id}`, course)
};

// Enrollments
export const enrollmentService = {
  getAll: () => api.get('/enrollment'),
  create: (enrollment) => api.post('/enrollment', enrollment)
};

// Stats
export const statsService = {
  getStudentsPerTeacher: () => api.get('/stats/getStudentsPerTeacher'),
  getCoursesWithEnrollmentStats: () => api.get('/stats/getCoursesWithEnrollmentStats')
};

export default api;
