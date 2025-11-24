import axios from 'axios';
import eventBus from '../utils/eventBus';

const baseURL = import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5089/api';

const API = axios.create({
    baseURL: baseURL,
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
            const responseData = error.response.data;


            if (Array.isArray(responseData) && responseData.length > 0) {
                message = responseData[0].description || responseData[0].code;
            }

            else if (typeof responseData === 'object') {

                if (responseData.detail) {
                    message = responseData.detail;
                }

                else if (responseData.title) {
                    message = responseData.title;
                }

                else if (responseData.errors) {
                    message = Object.values(responseData.errors).flat().join(' ');
                }
            }

            if (error.response.status === 401 && message === "An unexpected error occurred.") {
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