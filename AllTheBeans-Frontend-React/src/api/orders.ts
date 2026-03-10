import axiosInstance from './axios-instance';
import type { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from '../types/models';

export const ordersApi = {
    getMyOrders: async () => {
        const res = await axiosInstance.get<OrderResponseDto[]>('/orders');
        return res.data;
    },

    createOrder: async (data: CreateOrderDto) => {
        const res = await axiosInstance.post<{ message: string; orderId: number; }>('/orders', data);
        return res.data;
    },

    updateOrder: async (orderId: number, data: UpdateOrderDto) => {
        const res = await axiosInstance.put<{ message: string; }>(`/orders/${orderId}`, data);
        return res.data;
    },

    cancelOrder: async (orderId: number) => {
        const res = await axiosInstance.delete<{ message: string; }>(`/orders/${orderId}`);
        return res.data;
    }
};