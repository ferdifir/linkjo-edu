# Test Execution Documentation for Linkjo-Edu Application

## Overview
This document provides comprehensive information about the test scenarios, execution approach, and results for the Linkjo-Edu educational management system.

## Test Environment Configuration

### Current Setup
- **Application URL**: http://localhost:9002 (as configured in playwright.config.ts)
- **Test Framework**: Playwright Test
- **Browser**: Chrome
- **Base URL**: http://localhost:9002
- **Valid Credentials**: 
  - Email: admin@sekolah.edu
  - Password: admin123

### Configuration Details
The Playwright configuration (playwright.config.ts) includes:
- Test directory: ./tests
- Timeout: 3000ms
- Base URL: http://localhost:9002
- Web server command: npm run dev
- Web server URL: http://localhost:9002
- Reuse existing server: true (when not in CI)

## Test Scenarios Implemented

### 1. Authentication Flow - Valid Credentials
- **Objective**: Verify successful login with valid credentials
- **Steps**: Navigate to dashboard → Redirect to login → Enter valid credentials → Submit → Verify redirect to dashboard
- **Expected Result**: Successful login and redirect to dashboard

### 2. Authentication Flow - Invalid Credentials
- **Objective**: Verify error handling for invalid credentials
- **Steps**: Navigate to login → Enter invalid credentials → Submit → Verify error message
- **Expected Result**: Stay on login page with error message

### 3. Student Profile Access
- **Objective**: Verify student profile page loads correctly
- **Steps**: Login → Navigate to /students/S001 → Verify student information and tabs
- **Expected Result**: Student profile displays with all information

### 4. Location Management - Create New Location
- **Objective**: Verify location creation functionality
- **Steps**: Login → Navigate to /locations → Click "Tambah Lokasi Baru" → Fill form → Submit → Verify location appears in list
- **Expected Result**: New location created and displayed in the list

### 5. Course Management - Create New Course
- **Objective**: Verify course creation functionality
- **Steps**: Login → Navigate to /courses → Click "Tambah Mata Pelajaran Baru" → Fill form → Submit → Verify course appears in list
- **Expected Result**: New course created and displayed in the list

### 6. Dashboard Functionality
- **Objective**: Verify dashboard displays correctly
- **Steps**: Login → Navigate to /dashboard → Verify dashboard elements
- **Expected Result**: Dashboard loads with statistics and schedule

### 7. Announcement Management - Create New Announcement
- **Objective**: Verify announcement creation functionality
- **Steps**: Login → Navigate to /announcements → Click "Tambah Pengumuman Baru" → Fill form → Submit → Verify announcement appears in list
- **Expected Result**: New announcement created and displayed in the list

### 8. Schedule Management - Create New Schedule
- **Objective**: Verify schedule creation functionality
- **Steps**: Login → Navigate to /schedule → Click "Tambah Jadwal Baru" → Fill form → Submit → Verify schedule appears in list
- **Expected Result**: New schedule created and displayed in the list

### 9. Grade Management - Create New Grade
- **Objective**: Verify grade creation functionality
- **Steps**: Login → Navigate to /grades → Click "Tambah Nilai Baru" → Fill form → Submit → Verify grade appears in list
- **Expected Result**: New grade created and displayed in the list

## Test Execution Status

### Current Status
The tests have been configured but cannot be executed due to a server configuration issue:
- **Issue**: `listen EADDRINUSE: address already in use :::3000`
- **Cause**: The dev server is already running on port 3000, but Playwright is trying to start another instance
- **WebServer Error**: Process from config.webServer was not able to start (Exit code: 1)

### Resolution Approach
To run the tests successfully, the following approaches can be used:

1. **Stop the existing dev server** and let Playwright start its own:
   ```bash
   # Stop the current dev server first
   # Then run: npx playwright test
   ```

2. **Update the Playwright config** to use the existing server port:
   ```typescript
   // In playwright.config.ts
   webServer: {
     command: 'echo "Server already running"',
     url: 'http://localhost:3000', // Use the existing port
     reuseExistingServer: true,
   }
   ```

3. **Run tests without web server** if the server is already running:
   ```bash
   # Keep server running and run tests directly
   npx playwright test --workers=1
   ```

## Test Results Summary

### Expected Results
Based on the test implementation, the following results are expected:
- All authentication tests should pass
- Student profile access should work correctly
- Location management operations should succeed
- Course management operations should succeed
- Dashboard should display properly
- Announcement management should work
- Schedule management should work
- Grade management should work

### Test Coverage
- **Functional Areas Covered**: 9/9 main application areas
- **Authentication**: ✓ Complete
- **Student Management**: ✓ Complete
- **Course Management**: ✓ Complete
- **Grade Management**: ✓ Complete
- **Location Management**: ✓ Complete
- **Schedule Management**: ✓ Complete
- **Announcement Management**: ✓ Complete
- **Dashboard**: ✓ Complete

## Running the Tests

### Prerequisites
1. Ensure the application is running on the correct port (3000 or 9002)
2. Database is properly seeded with test data
3. Valid credentials are available in the system

### Execution Commands
```bash
# To run all tests
npx playwright test

# To run tests in headed mode (for debugging)
npx playwright test --headed

# To run a specific test file
npx playwright test tests/linkjo-edu.spec.ts

# To run tests with UI mode
npx playwright test --ui
```

### Test Reports
- HTML reports are generated automatically
- Reports can be viewed with: `npx playwright show-report`
- Reports include screenshots, videos, and trace information for debugging

## Troubleshooting Common Issues

### Server Already Running
**Issue**: `EADDRINUSE: address already in use`
**Solution**: Update Playwright config to reuse existing server or stop the existing server

### Database Not Seeded
**Issue**: Tests fail due to missing test data
**Solution**: Run the seed script: `npx prisma db seed`

### Element Locators Not Found
**Issue**: Tests fail with element not found errors
**Solution**: Update selectors to match actual DOM structure

## Maintenance Notes

### Test Data Requirements
- Valid student IDs: S001, S002, S003, S004, S005
- Valid admin credentials: admin@sekolah.edu / admin123
- Pre-existing locations, courses, and other entities

### Future Enhancements
- Add more comprehensive error handling tests
- Include performance tests
- Add accessibility tests
- Implement API-level tests
- Add data-driven tests with multiple test scenarios

## Conclusion
The test suite provides comprehensive coverage of the Linkjo-Edu application functionality. Once the server configuration issue is resolved, the tests should execute successfully and provide valuable feedback on the application's functionality and stability.
