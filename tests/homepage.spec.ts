import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Linkjo/);
  await expect(page.locator('h1')).toContainText(/Selamat Datang di Linkjo/);
});

test('login page works', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/Linkjo/);
  
  // Check if login form elements are present
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('dashboard page requires authentication', async ({ page }) => {
  // Try to access dashboard without login
  await page.goto('/dashboard');
  
  // Should redirect to login page
  await expect(page).toHaveURL(/.*login/);
});

test('announcements page loads', async ({ page }) => {
  // Navigate to announcements (should redirect to login)
  await page.goto('/announcements');
  
  // Should redirect to login page with callback URL since it's a protected route
  await expect(page).toHaveURL(/.*login/);
  
  // Login with valid credentials
  await page.fill('input[name="email"]', 'admin@sekolah.edu');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Now navigate to announcements
 await page.goto('/announcements');
  await expect(page.locator('h1')).toContainText(/Pengumuman/);
});
