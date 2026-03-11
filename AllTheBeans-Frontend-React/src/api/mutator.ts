import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios-client';

// Export the mutator function that Orval will use
export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    return axiosInstance({
        ...config,
        ...options,
    }).then((response) => response.data);
};