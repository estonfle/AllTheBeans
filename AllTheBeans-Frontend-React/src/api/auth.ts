import axiosInstance from './axios-client';
import type { LoginDto, RegisterDto, AuthResponseDto } from '../types/models';

export const authApi = {
    login: async (data: LoginDto) => {
        const res = await axiosInstance.post<AuthResponseDto>('/auth/login', data);
        return res.data;
    },

    register: async (data: RegisterDto) => {
        const res = await axiosInstance.post<AuthResponseDto>('/auth/register', data);
        return res.data;
    }
};