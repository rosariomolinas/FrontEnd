import { defineConfig, devices } from '@playwright/test';

// Tests end-to-end: manejan la app en un navegador real contra el backend real.
// Antes de correrlos, el backend tiene que estar levantado con los datos de `npm run seed` (ver README).
export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Levanta el frontend si no está corriendo.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 180000,
    env: { BROWSER: 'none' },
  },
});
