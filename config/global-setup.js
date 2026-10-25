const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

/**
 * Runs once before the whole suite. Logs into OrangeHRM via the UI and saves
 * the authenticated storage state to config/.auth/user.json, which every
 * chromium/firefox/webkit project then reuses via `storageState` in
 * playwright.config.js — so individual specs never repeat login steps.
 */

module.exports = async () => {
  const authDir = path.resolve(__dirname, '.auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  const baseURL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
  const username = process.env.ADMIN_USERNAME || 'Admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  page.setDefaultNavigationTimeout(5_60_000);

  await page.goto('/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/**');

  await page.context().storageState({ path: path.resolve(authDir, 'user.json') });
  await browser.close();
};
