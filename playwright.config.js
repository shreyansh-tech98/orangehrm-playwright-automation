// @ts-check
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Load env file based on ENV variable: qa (default) | staging | prod
const envName = process.env.ENV || 'qa';
const envFile = envName === 'qa' ? '.env' : `.env.${envName}`;
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Global setup/teardown live in /config — used for auth state, DB seeding, etc.
  globalSetup: require.resolve('./config/global-setup.js'),
  globalTeardown: require.resolve('./config/global-teardown.js'),

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 2 * 60 * 1000,
    navigationTimeout: 3*60* 1000,
  },

  projects: [
    // globalSetup (config/global-setup.js) logs in once via UI and writes
    // config/.auth/user.json — every browser project below reuses that state.
    {
      name: 'login',
      testDir: './tests/e2e',
      testMatch: '**/login.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'config/.auth/user.json' },
      testDir: './tests/e2e',
      testIgnore: ['**/api/**', '**/login.spec.js'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'config/.auth/user.json' },
      testDir: './tests',
      testIgnore: ['**/api/**', '**/login.spec.js'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'config/.auth/user.json' },
      testDir: './tests',
      testIgnore: ['**/api/**', '**/login.spec.js'],
    },
    {
      // API tests don't need a browser context or auth storage state
      name: 'api',
      testDir: './tests/api',
      use: {},
    },
  ],
});
