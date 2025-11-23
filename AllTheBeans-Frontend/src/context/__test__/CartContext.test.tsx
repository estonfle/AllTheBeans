import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../CartContext';
import type { CoffeeBean } from '../../types';

// Helper component to expose Context to the test
const TestComponent = () => {
    const { items, addToCart, totalCost, removeFromCart } = useCart();
    return (
        <div>
            <span data-testid="count">{items.length}</span>
            <span data-testid="total">{totalCost}</span>
            <button onClick={() => addToCart({ id: 1, name: 'Bean A', cost: 10 } as CoffeeBean, 2)}>Add A</button>
            <button onClick={() => removeFromCart(1)}>Remove A</button>
        </div>
    );
};

describe('CartContext', () => {
    it('calculates total cost and updates items', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // 1. Initial State
        expect(screen.getByTestId('count')).toHaveTextContent('0');

        // 2. Add Item (Cost 10 * Qty 2 = 20)
        await user.click(screen.getByText('Add A'));

        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('total')).toHaveTextContent('20');

        // 3. Remove Item
        await user.click(screen.getByText('Remove A'));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('total')).toHaveTextContent('0');
    });
});