import axios from 'axios';
import eventBus from '../utils/eventBus';

const API = axios.create({
    baseURL: 'http://localhost:5089',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Inject Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Global Error Handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "An unexpected error occurred.";

        if (error.response) {
            const data = error.response.data[0];
            message = data.description || data.code;

            if (data.errors) {
                const validationMessages = Object.values(data.errors).flat().join(' ');
                message = validationMessages || message;
            }

            if (error.response.status === 401) {
                message = "Session expired. Please login again.";
            }
        } else if (error.request) {
            message = "Network error. Is the backend running?";
        }

        eventBus.dispatch('SHOW_TOAST', { message, type: 'error' });
        return Promise.reject(error);
    }
);

export default API;