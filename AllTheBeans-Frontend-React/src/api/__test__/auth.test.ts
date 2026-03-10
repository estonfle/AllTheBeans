import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getAuth } from '../../types/endpoints/auth/auth';
import { getAuthMock, getLoginMockHandler } from '../../types/endpoints/auth/auth.msw';
import type { LoginDto } from '../../types/models';

// 1. Setup the MSW server with Orval's generated default mocks
const server = setupServer(...getAuthMock());

// 2. Start the server before tests, reset between tests, and close after
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth API - Login', () => {
    const mockCredentials: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!'
    };

    it('should login successfully and return random faker data (Default Mock)', async () => {
        const { login } = getAuth();
        const response = await login(mockCredentials);

        expect(response).toBeDefined();
        expect(response).toHaveProperty('token');
        expect(response).toHaveProperty('email');
        expect(response).toHaveProperty('username');
        expect(typeof response.token).toBe('string');
    });

    it('should login successfully with explicitly overridden mock data', async () => {
        // Arrange: Create a specific expected response
        const customResponse = {
            token: 'fake-jwt-token-12345',
            username: 'john_doe',
            email: 'john@example.com'
        };

        // Override the default mock handler for this specific test
        server.use(getLoginMockHandler(customResponse));

        const { login } = getAuth();
        const response = await login(mockCredentials);

        expect(response.token).toBe('fake-jwt-token-12345');
        expect(response.username).toBe('john_doe');
        expect(response.email).toBe('john@example.com');
    });

    it('should handle a 401 Unauthorized login failure gracefully', async () => {
        // Arrange: Override MSW to simulate a server error (e.g., wrong password)
        server.use(
            http.post('*/api/auth/login', () => {
                return new HttpResponse(
                    JSON.stringify({ message: 'Invalid credentials' }),
                    {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );

        const { login } = getAuth();

        await expect(login(mockCredentials)).rejects.toThrow();
    });
});