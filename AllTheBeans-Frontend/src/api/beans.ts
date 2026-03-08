import axiosInstance from './axios-instance';
import type { CoffeeBean } from '../types/models';
import type { PagedResult, PaginationParams } from '../types/common';

export const beansApi = {
    getAll: async (params: PaginationParams = { search: '', page: 1, pageSize: 9 }) => {
        const res = await axiosInstance.get<PagedResult<CoffeeBean>>('/beans', {
            params: params
        });
        return res.data;
    },

    getById: async (id: string | number) => {
        const res = await axiosInstance.get<CoffeeBean>(`/beans/${id}`);
        return res.data;
    },

    getBotd: async () => {
        const res = await axiosInstance.get<CoffeeBean>('/beans/botd');
        return res.data;
    }
};