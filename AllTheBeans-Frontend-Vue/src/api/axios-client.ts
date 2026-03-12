import axios from 'axios';
import i18n from '../i18n/config';

const baseURL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:5089';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to inject the Accept-Language header
axiosInstance.interceptors.request.use(
    (config) => {
        const currentLocale = i18n.global.locale.value;

        config.headers['Accept-Language'] = currentLocale;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;