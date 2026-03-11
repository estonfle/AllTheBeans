import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // Existing aliases (if you have them)
      '@': path.resolve(__dirname, './src'),

      // Intercept requests to 'void-elements'
      'void-elements': path.resolve(__dirname, './src/helpers/void-elements.ts')
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});