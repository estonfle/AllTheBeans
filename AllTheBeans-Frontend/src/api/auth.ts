import API from './client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authApi = {
    login: async (data: LoginRequest) => {
        const res = await API.post<AuthResponse>('/auth/login', data);
        return res.data;
    },

    register: async (data: RegisterRequest) => {
        const res = await API.post('/auth/register', data);
        return res.data;
    }
};