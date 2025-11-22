import API from './client';
import type { CoffeeBean } from '../types';

export const beansApi = {
    getAll: async (searchQuery: string = '') => {
        const res = await API.get<CoffeeBean[]>(`/beans?search=${encodeURIComponent(searchQuery)}`);
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