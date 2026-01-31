
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
    updateFestivalInfo: (id, data) => api.put(`/admin/festival/${id}`, data),
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
        if (data instanceof FormData) {
            return axios.post(`${API_BASE_URL}/competitions/photo`, data, {
                headers: {},
            });
        }
        return api.post('/competitions/photo', data);
    },
    registerReel: (data) => api.post('/competitions/reel', data),
    registerPainting: (data) => api.post('/competitions/painting', data),
};

// Quiz API
export const quizAPI = {
    getPublishedQuizzes: (lang) => api.get(`/quiz/published${lang ? `?lang=${lang}` : ''}`),
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
        if (data instanceof FormData) {
            return axios.post(`${API_BASE_URL}/volunteers`, data, {
                headers: {},
            });
        }
        return api.post('/volunteers', data);
    },
};

// Gallery API
export const galleryAPI = {
    getImages: () => api.get('/gallery'),
    uploadImage: (data) => {
        if (data instanceof FormData) {
            // Let browser set content type for FormData
            return axios.post(`${API_BASE_URL}/admin/gallery`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
            });
        }
        return api.post('/admin/gallery', data);
    },
    deleteImage: (id) => api.delete(`/admin/gallery/${id}`),
};

export default api;