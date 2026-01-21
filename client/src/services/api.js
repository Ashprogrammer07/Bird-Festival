import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Festival Info API
export const festivalAPI = {
    getFestivalInfo: () => api.get('/festival'),
};

// Schedule API
export const scheduleAPI = {
    getAllSchedules: () => api.get('/schedule'),
    getScheduleByDay: (day) => api.get(`/schedule/${day}`),
};

// Contact API
export const contactAPI = {
    submitContact: (data) => api.post('/contact', data),
};

// E-book API
export const ebookAPI = {
    getEbook: () => api.get('/ebook'),
    incrementDownload: (id) => api.patch(`/ebook/${id}/download`),
};

// Reading Progress API
export const readingAPI = {
    startReading: (data) => api.post('/reading/start', data),
    updateReading: (data) => api.post('/reading/update', data),
    getProgress: (ebookId, readerId) => api.get(`/reading/progress/${ebookId}/${readerId}`),
    getCompletionStats: (ebookId) => api.get(`/reading/stats/${ebookId}`),
};

// Competitions API
export const competitionAPI = {
    registerPhoto: (data) => {
        // If data is FormData, create a new request without default headers
        if (data instanceof FormData) {
            // Create a new axios instance without default Content-Type for this request
            return axios.post(`${API_BASE_URL}/competitions/photo`, data, {
                headers: {
                    // Let browser automatically set Content-Type with boundary for multipart/form-data
                },
            });
        }
        return api.post('/competitions/photo', data);
    },
    registerReel: (data) => api.post('/competitions/reel', data),
    registerPainting: (data) => api.post('/competitions/painting', data),
};

// src/services/api.js or quizApi.js
export const quizAPI = {
    getPublishedQuizzes: () => api.get("/quiz/published"),
    submitQuiz: (data) => api.post("/quiz/submit", data),
};


// Pledge API
export const pledgeAPI = {
    takePledge: (data) => api.post('/pledge', data),
};

// Resource Person API
export const resourcePersonAPI = {
    register: (data) => api.post('/resource-person', data),
};

// Volunteer API
export const volunteerAPI = {
    register: (data) => {
        // If data is FormData, create a new request without default headers
        if (data instanceof FormData) {
            return axios.post(`${API_BASE_URL}/volunteers`, data, {
                headers: {
                    // Let browser automatically set Content-Type with boundary for multipart/form-data
                },
            });
        }
        return api.post('/volunteers', data);
    },
};

export default api;