import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CoffeeBean } from '../types';

interface CartItem {
    bean: CoffeeBean;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (bean: CoffeeBean, qty?: number) => void;
    removeFromCart: (beanId: number) => void;
    clearCart: () => void;
    totalCost: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode; }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (bean: CoffeeBean, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.bean.id === bean.id);
            if (existing) {
                return prev.map(i => i.bean.id === bean.id
                    ? { ...i, quantity: i.quantity + qty }
                    : i);
            }
            return [...prev, { bean, quantity: qty }];
        });
    };

    const removeFromCart = (beanId: number) => {
        setItems(prev => prev.filter(i => i.bean.id !== beanId));
    };

    const clearCart = () => setItems([]);

    const totalCost = items.reduce((sum, item) => sum + (item.bean.cost * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalCost }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};