import axiosInstance from './axios-client';
import type { CoffeeBean, GetAllBeansParams, CoffeeBeanPagedResultDto } from '../types/models';

export const beansApi = {
    getAll: async (params: GetAllBeansParams = { search: '', page: 1, pageSize: 9 }) => {
        const res = await axiosInstance.get<CoffeeBeanPagedResultDto>('/beans', {
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