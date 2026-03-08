export interface CoffeeBean {
    id: number;
    name: string;
    description: string;
    image: string;
    colour: string;
    country: string;
    cost: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

// --- Auth Contracts ---
export interface AuthResponse {
    token: string;
    email: string;
    username: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// --- Order Contracts (Inputs) ---
export interface OrderItemRequest {
    beanId: number;
    quantity: number;
}

export interface CreateOrderRequest {
    items: OrderItemRequest[];
}

export interface UpdateOrderRequest {
    items: OrderItemRequest[];
}

// --- Order Contracts (Outputs) ---
export interface OrderItemResponse {
    beanId: number;
    beanName: string;
    image: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderResponse {
    orderId: number;
    orderDate: string;
    totalCost: number;
    items: OrderItemResponse[];
}

