import { test, expect } from '@playwright/test';

test.describe('Linkjo-Edu Application Tests', () => {
  const BASE_URL = 'http://localhost:9002';
  const VALID_EMAIL = 'admin@sekolah.edu';
  const VALID_PASSWORD = 'admin123';

  test.beforeEach(async ({ page }) => {
    // Ensure we start with a clean state
    await page.goto(BASE_URL);
  });

  test('Authentication Flow - Valid Credentials', async ({ page }) => {
    // Test case 5: Authentication Flow
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should be redirected to login
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    
    // Fill in valid credentials
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    
    // Submit login
    await page.locator('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });

  test('Authentication Flow - Invalid Credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in invalid credentials
    await page.locator('input[name="email"]').fill('invalid@example.com');
    await page.locator('input[name="password"]').fill('invalidpassword');
    
    // Submit login
    await page.locator('button[type="submit"]').click();
    
    // Should stay on login page with error message
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    // Add assertion for error message if it exists
  });

  test('Student Profile Access', async ({ page }) => {
    // Test case 1: Student Profile Access
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to student profile
    await page.goto(`${BASE_URL}/students/S001`);
    
    // Verify page loads without errors
    await expect(page).toHaveURL(`${BASE_URL}/students/S001`);
    
    // Verify student information is displayed
    await expect(page.locator('h1:has-text("Liam Johnson")')).toBeVisible();
    
    // Verify tabs exist
    await expect(page.locator('button:has-text("Profil")')).toBeVisible();
    await expect(page.locator('button:has-text("Nilai")')).toBeVisible();
    await expect(page.locator('button:has-text("Kehadiran")')).toBeVisible();
    await expect(page.locator('button:has-text("Laporan Kinerja AI")')).toBeVisible();
  });

  test('Location Management - Create New Location', async ({ page }) => {
    // Test case 2: Location Management
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to locations
    await page.goto(`${BASE_URL}/locations`);
    
    // Click add location button
    await page.locator('button:has-text("Tambah Lokasi Baru")').click();
    
    // Verify we're on the new location page
    await expect(page).toHaveURL(`${BASE_URL}/locations/new`);
    
    // Fill in location form
    await page.locator('input[name="name"]').fill('Test Gedung Baru');
    await page.locator('textarea[name="description"]').fill('Test description for new building');
    
    // Submit form
    await page.locator('button:has-text("Simpan Lokasi")').click();
    
    // Should be redirected back to locations page
    await expect(page).toHaveURL(`${BASE_URL}/locations`);
    
    // Verify new location appears in the list
    await expect(page.locator('text="Test Gedung Baru"')).toBeVisible();
  });

 test('Course Management - Create New Course', async ({ page }) => {
    // Test case 3: Course Management
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to courses
    await page.goto(`${BASE_URL}/courses`);
    
    // Click add course button
    await page.locator('button:has-text("Tambah Mata Pelajaran Baru")').click();
    
    // Verify we're on the new course page
    await expect(page).toHaveURL(`${BASE_URL}/courses/new`);
    
    // Fill in course form
    await page.locator('input[name="name"]').fill('Test Course');
    await page.locator('input[name="teacher"]').fill('Test Teacher');
    await page.locator('input[name="schedule"]').fill('Test Schedule');
    
    // Submit form
    await page.locator('button:has-text("Simpan Mata Pelajaran")').click();
    
    // Should be redirected back to courses page
    await expect(page).toHaveURL(`${BASE_URL}/courses`);
    
    // Verify new course appears in the list
    await expect(page.locator('text="Test Course"')).toBeVisible();
  });

  test('Dashboard Functionality', async ({ page }) => {
    // Test case 6: Dashboard Functionality
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Verify dashboard loads
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    
    // Verify dashboard elements are visible
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text="Jumlah Siswa"')).toBeVisible();
    await expect(page.locator('text="Rata-rata Kehadiran"')).toBeVisible();
    await expect(page.locator('text="Rata-rata Nilai"')).toBeVisible();
  });

 test('Announcement Management - Create New Announcement', async ({ page }) => {
    // Test case 8: Announcement Management
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to announcements
    await page.goto(`${BASE_URL}/announcements`);
    
    // Click add announcement button
    await page.locator('button:has-text("Tambah Pengumuman Baru")').click();
    
    // Verify we're on the new announcement page
    await expect(page).toHaveURL(`${BASE_URL}/announcements/new`);
    
    // Fill in announcement form
    await page.locator('input[name="title"]').fill('Test Announcement');
    await page.locator('textarea[name="content"]').fill('Test announcement content');
    await page.locator('input[name="author"]').fill('Test Author');
    
    // Submit form
    await page.locator('button:has-text("Simpan Pengumuman")').click();
    
    // Should be redirected back to announcements page
    await expect(page).toHaveURL(`${BASE_URL}/announcements`);
    
    // Verify new announcement appears in the list
    await expect(page.locator('text="Test Announcement"')).toBeVisible();
  });

  test('Schedule Management - Create New Schedule', async ({ page }) => {
    // Test case 7: Schedule Management
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to schedule
    await page.goto(`${BASE_URL}/schedule`);
    
    // Click add schedule button
    await page.locator('button:has-text("Tambah Jadwal Baru")').click();
    
    // Verify we're on the new schedule page
    await expect(page).toHaveURL(`${BASE_URL}/schedule/new`);
    
    // Fill in schedule form (this might vary based on the actual form structure)
    // Since we don't know the exact selectors, we'll use general approach
    await page.locator('input').first().fill('08:00-09:00');
    
    // Submit form
    await page.locator('button:has-text("Simpan Jadwal")').click();
    
    // Should be redirected back to schedule page
    await expect(page).toHaveURL(`${BASE_URL}/schedule`);
  });

  test('Grade Management - Create New Grade', async ({ page }) => {
    // Test case 4: Grade Management
    // First login
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[name="email"]').fill(VALID_EMAIL);
    await page.locator('input[name="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Navigate to grades
    await page.goto(`${BASE_URL}/grades`);
    
    // Click add grade button
    await page.locator('button:has-text("Tambah Nilai Baru")').click();
    
    // Verify we're on the new grade page
    await expect(page).toHaveURL(`${BASE_URL}/grades/new`);
    
    // Fill in grade form (actual selectors may vary)
    // Since we don't know the exact selectors, we'll use general approach
    await page.locator('input[name="assignment"]').fill('Test Assignment');
    await page.locator('input[name="grade"]').fill('90');
    
    // Submit form
    await page.locator('button:has-text("Simpan Nilai")').click();
    
    // Should be redirected back to grades page
    await expect(page).toHaveURL(`${BASE_URL}/grades`);
  });
});
