import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosClient';

// Export the mutator function that Orval will use
export const customAxiosInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    return axiosInstance({
        ...config,
        ...options,
    }).then((response) => response.data);
};

// export const customAxiosInstance = async <T>(
//   config: AxiosRequestConfig,
//   options?: AxiosRequestConfig
// ): Promise<T> => {
//   const promise = axiosInstance({
//     ...config,
//     ...options,
//   }).then(({ data }) => data);

//   return promise;
// };