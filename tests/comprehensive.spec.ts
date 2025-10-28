import { test, expect } from '@playwright/test';

// Test all pages and functionality
test.describe('Comprehensive Application Tests', () => {
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

  test('Dashboard page requires authentication', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('Announcements page requires authentication', async ({ page }) => {
    // Try to access announcements without login
    await page.goto('/announcements');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('Courses page requires authentication', async ({ page }) => {
    // Try to access courses without login
    await page.goto('/courses');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

 test('Grades page requires authentication', async ({ page }) => {
    // Try to access grades without login
    await page.goto('/grades');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

 test('Schedule page requires authentication', async ({ page }) => {
    // Try to access schedule without login
    await page.goto('/schedule');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

 test('Students page requires authentication', async ({ page }) => {
    // Try to access students without login
    await page.goto('/students');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

 test('Locations page requires authentication', async ({ page }) => {
    // Try to access locations without login
    await page.goto('/locations');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

 test('Attendance page requires authentication', async ({ page }) => {
    // Try to access attendance without login
    await page.goto('/attendance');
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('Login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL('**/dashboard');
  });

  test('Dashboard page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Dashboard should load with stats
    await expect(page.locator('h1')).toContainText(/Dashboard/);
    await expect(page.locator('text=Statistik Sekolah')).toBeVisible();
  });

  test('Announcements page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to announcements
    await page.goto('/announcements');
    await expect(page.locator('h1')).toContainText(/Pengumuman/);
  });

  test('Courses page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to courses
    await page.goto('/courses');
    await expect(page.locator('h1')).toContainText(/Kursus/);
  });

  test('Grades page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to grades
    await page.goto('/grades');
    await expect(page.locator('h1')).toContainText(/Nilai/);
  });

  test('Schedule page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to schedule
    await page.goto('/schedule');
    await expect(page.locator('h1')).toContainText(/Jadwal/);
  });

  test('Students page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to students
    await page.goto('/students');
    await expect(page.locator('h1')).toContainText(/Siswa/);
  });

 test('Locations page loads after login', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Navigate to locations
    await page.goto('/locations');
    await expect(page.locator('h1')).toContainText(/Lokasi/);
  });

  test('Logout functionality', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Click on user profile/logout button (assuming it's in the header)
    await page.locator('button[aria-label="User menu"]').click();
    await page.locator('text=Keluar').click();
    
    // Should redirect back to login
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page).toHaveURL('**/login');
  });

  test('Add new announcement form', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
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
    await page.waitForURL('**/announcements', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(/Pengumuman/);
  });

  test('Add new student form', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
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
    await page.waitForURL('**/students', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(/Siswa/);
  });

  test('Add new grade form', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@sekolah.edu');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Go to grades
    await page.goto('/grades');
    
    // Click add grade button
    await page.locator('text=Tambah Nilai').click();
    
    // Should navigate to new grade page
    await expect(page).toHaveURL('**/grades/new');
    await expect(page.locator('h1')).toContainText(/Tambah Nilai/);
    
    // The form may have dropdowns for student and subject, fill what we can
    // This test assumes the form structure based on the application
 });
});
