/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  esbuild: {
    tsconfigRaw: '{}',
  },
  resolve: {
    alias: {
      '@': 'src',
    },
  },
});
