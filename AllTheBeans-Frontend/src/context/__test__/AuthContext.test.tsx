import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock jwt-decode to control time
vi.mock('jwt-decode', () => ({
    jwtDecode: () => ({ sub: 'test@test.com', username: 'TestUser', exp: 9999999999 })
}));

const TestAuth = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</div>
            <div data-testid="user-email">{user?.email}</div>
            <button onClick={() => login('fake-token', 'test@test.com')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('updates state on login and logout', async () => {
        const { default: userEvent } = await import('@testing-library/user-event'); // Dynamic import for setup
        const user = userEvent.setup();

        render(
            <AuthProvider>
                <TestAuth />
            </AuthProvider>
        );

        // 1. Start Logged Out
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');

        // 2. Login
        await user.click(screen.getByText('Login'));
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com');

        // 3. Logout
        await user.click(screen.getByText('Logout'));
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
        expect(screen.queryByTestId('user-email')).toBeEmptyDOMElement();
    });
});