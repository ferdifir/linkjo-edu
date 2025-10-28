import { test, expect } from '@playwright/test';

// Test core functionality of the application
test.describe('Core Application Tests', () => {
  // Test each page is accessible when authenticated
 test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Linkjo/);
    await expect(page.locator('h1')).toContainText(/Selamat Datang di Linkjo/);
 });

  test('Login page works', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Linkjo/);
    
    // Check if login form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Protected routes redirect to login when not authenticated', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/announcements', '/courses', '/grades', '/schedule', '/students', '/locations', '/attendance'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('Login with valid credentials works', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful login
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL('**/dashboard');
  });

  test('Dashboard page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Dashboard should load with stats
    await expect(page.locator('h1')).toContainText(/Dashboard/);
    await expect(page.locator('text=Statistik Sekolah')).toBeVisible();
  });

  test('Announcements page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to announcements
    await page.goto('/announcements');
    await expect(page.locator('h1')).toContainText(/Pengumuman/);
  });

  test('Courses page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to courses
    await page.goto('/courses');
    await expect(page.locator('h1')).toContainText(/Kursus/);
  });

  test('Grades page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to grades
    await page.goto('/grades');
    await expect(page.locator('h1')).toContainText(/Nilai/);
  });

 test('Schedule page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to schedule
    await page.goto('/schedule');
    await expect(page.locator('h1')).toContainText(/Jadwal/);
  });

 test('Students page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to students
    await page.goto('/students');
    await expect(page.locator('h1')).toContainText(/Siswa/);
  });

  test('Locations page loads after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to locations
    await page.goto('/locations');
    await expect(page.locator('h1')).toContainText(/Lokasi/);
 });

  test('Add new announcement form works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Go to announcements
    await page.goto('/announcements');
    
    // Click add announcement button
    await page.locator('text=Tambah Pengumuman').click();
    
    // Should navigate to new announcement page
    await expect(page).toHaveURL('**/announcements/new');
    await expect(page.locator('h1')).toContainText(/Tambah Pengumuman/);
    
    // Fill the form
    await page.fill('input[name="title"]', 'Test Announcement');
    await page.fill('textarea[name="content"]', 'This is a test announcement content');
    await page.fill('input[name="author"]', 'Test Author');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect back to announcements page
    await page.waitForURL('**/announcements', { timeout: 1500 });
    await expect(page.locator('h1')).toContainText(/Pengumuman/);
  });

  test('Add new student form works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Go to students
    await page.goto('/students');
    
    // Click add student button
    await page.locator('text=Tambah Siswa').click();
    
    // Should navigate to new student page
    await expect(page).toHaveURL('**/students/new');
    await expect(page.locator('h1')).toContainText(/Tambah Siswa/);
    
    // Fill the form
    await page.fill('input[name="name"]', 'Test Student');
    await page.fill('input[name="email"]', 'test.student@example.com');
    await page.fill('input[name="class"]', 'Test Class');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect back to students page
    await page.waitForURL('**/students', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Siswa/);
  });

  test('Add new grade form works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 1500 });
    
    // Go to grades
    await page.goto('/grades');
    
    // Click add grade button
    await page.locator('text=Tambah Nilai').click();
    
    // Should navigate to new grade page
    await expect(page).toHaveURL('**/grades/new');
    await expect(page.locator('h1')).toContainText(/Tambah Nilai/);
    
    // Fill the form - wait for dropdowns to load
    await page.waitForSelector('select[name="studentId"]', { timeout: 10000 });
    await page.waitForSelector('select[name="subject"]', { timeout: 10000 });
    
    // Select student and subject from dropdowns
    await page.locator('select[name="studentId"]').click();
    await page.locator('select[name="studentId"] option').first().click();
    
    await page.locator('select[name="subject"]').click();
    await page.locator('select[name="subject"] option').first().click();
    
    // Fill assignment and grade
    await page.fill('input[name="assignment"]', 'Test Assignment');
    await page.fill('input[name="grade"]', '85');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect back to grades page
    await page.waitForURL('**/grades', { timeout: 1500 });
    await expect(page.locator('h1')).toContainText(/Nilai/);
  });
});
