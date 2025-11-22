import API from './client';
import type { CreateOrderRequest, UpdateOrderRequest, OrderResponse } from '../types';

export const ordersApi = {
    getMyOrders: async () => {
        const res = await API.get<OrderResponse[]>('/orders');
        return res.data;
    },

    createOrder: async (data: CreateOrderRequest) => {
        const res = await API.post<{ message: string; orderId: number; }>('/orders', data);
        return res.data;
    },

    updateOrder: async (orderId: number, data: UpdateOrderRequest) => {
        const res = await API.put<{ message: string; }>(`/orders/${orderId}`, data);
        return res.data;
    },

    cancelOrder: async (orderId: number) => {
        const res = await API.delete<{ message: string; }>(`/orders/${orderId}`);
        return res.data;
    }
};