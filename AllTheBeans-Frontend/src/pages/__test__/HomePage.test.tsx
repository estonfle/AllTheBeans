import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../HomePage';
import { beansApi } from '../../api/beans';
import { CartProvider } from '../../context/CartContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../api/beans', () => ({
    beansApi: {
        getAll: vi.fn(),
        getBotd: vi.fn()
    }
}));

const renderPage = () => render(
    <NotificationProvider>
        <CartProvider>
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        </CartProvider>
    </NotificationProvider>
);

describe('HomePage', () => {
    it('fetches and displays beans', async () => {
        // 1. Arrange: Create TWO different beans
        const listBean = {
            id: 1,
            name: 'Regular List Bean', // Unique Name
            cost: 10,
            image: 'img.jpg',
            country: 'Peru',
            description: 'Desc',
            colour: 'Green'
        };

        const botdBean = {
            id: 2,
            name: 'Special Star Bean', // Unique Name
            cost: 15,
            image: 'img.jpg',
            country: 'Brazil',
            description: 'Desc',
            colour: 'Red'
        };

        // 2. Setup Return Values
        vi.mocked(beansApi.getAll).mockResolvedValue({
            items: [listBean],
            totalCount: 1,
            pageNumber: 1,
            pageSize: 12
        });

        vi.mocked(beansApi.getBotd).mockResolvedValue(botdBean);

        // Act
        renderPage();

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // 3. Assert: Check for BOTH beans
        await waitFor(() => {
            // This proves the Grid loaded
            expect(screen.getByText('Regular List Bean')).toBeInTheDocument();

            // This proves the BOTD widget loaded
            expect(screen.getByText('Special Star Bean')).toBeInTheDocument();
        });
    });
});