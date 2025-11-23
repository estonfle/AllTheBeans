import API from './client';
import type { CoffeeBean, PagedResult } from '../types';

export const beansApi = {
    getAll: async (search: string = '', page: number = 1) => {
        const res = await API.get<PagedResult<CoffeeBean>>('/beans', {
            params: { search, page, pageSize: 9 }
        });
        return res.data;
    },

    getById: async (id: string | number) => {
        const res = await API.get<CoffeeBean>(`/beans/${id}`);
        return res.data;
    },

    getBotd: async () => {
        const res = await API.get<CoffeeBean>('/beans/botd');
        return res.data;
    }
};