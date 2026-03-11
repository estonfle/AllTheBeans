import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios-client';

// Export the mutator function that Orval will use
export const customAxiosInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    return axiosInstance({
        ...config,
        ...options,
    }).then(({ data }) => data);
};

