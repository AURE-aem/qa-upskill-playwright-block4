import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const appUrl =
  process.env.CLIENT_ORIGIN ?? 'http://localhost:4321';

const apiUrl =
  process.env.PUBLIC_API_URL ?? 'http://localhost:4000';

export default defineConfig({
  testDir: './e2e/tests',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: appUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  webServer: [
    {
      command: 'npm run dev -w apps/api',
      url: `${apiUrl}/health`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -w apps/web',
      url: appUrl,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],

  projects: [
    {
      name: 'desktop-chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
      },
    },
  ],
});
