-- Create the new tables first
CREATE TABLE `academic_years` (
    `id` VARCHAR(255) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `semesters` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert a default academic year and semester for existing data
INSERT INTO `academic_years` (`id`, `year`, `description`, `isActive`) 
VALUES ('ACY001', '2023/2024', 'Tahun Ajaran Default', true);

INSERT INTO `semesters` (`id`, `name`, `startDate`, `endDate`, `academicYearId`) 
VALUES ('SEM001', 'Ganjil', '2023-08-01 00:00', '2024-01-31 23:59:59', 'ACY001');

-- Drop existing foreign key constraints
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_fridayCourseId_fkey`;
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_mondayCourseId_fkey`;
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_thursdayCourseId_fkey`;
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_tuesdayCourseId_fkey`;
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_wednesdayCourseId_fkey`;

-- Add new columns as optional first
ALTER TABLE `schedules` 
    ADD COLUMN `academicYearId` VARCHAR(191) NULL,
    ADD COLUMN `class` VARCHAR(191) NULL,
    ADD COLUMN `courseId` VARCHAR(191) NULL,
    ADD COLUMN `dayOfWeek` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `semesterId` VARCHAR(191) NULL,
    ADD COLUMN `teacherName` VARCHAR(191) NULL;

-- Update the new columns with data from old columns based on day
-- For Monday schedules
UPDATE `schedules` 
SET `dayOfWeek` = 'MONDAY', 
    `courseId` = `mondayCourseId`, 
    `teacherName` = `mondayTeacher`,
    `class` = 'Kelas Umum',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `mondayCourseId` IS NOT NULL;

-- For Tuesday schedules
UPDATE `schedules` 
SET `dayOfWeek` = 'TUESDAY', 
    `courseId` = `tuesdayCourseId`, 
    `teacherName` = `tuesdayTeacher`,
    `class` = 'Kelas Umum',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `tuesdayCourseId` IS NOT NULL;

-- For Wednesday schedules
UPDATE `schedules` 
SET `dayOfWeek` = 'WEDNESDAY', 
    `courseId` = `wednesdayCourseId`, 
    `teacherName` = `wednesdayTeacher`,
    `class` = 'Kelas Umum',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `wednesdayCourseId` IS NOT NULL;

-- For Thursday schedules
UPDATE `schedules` 
SET `dayOfWeek` = 'THURSDAY', 
    `courseId` = `thursdayCourseId`, 
    `teacherName` = `thursdayTeacher`,
    `class` = 'Kelas Umum',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `thursdayCourseId` IS NOT NULL;

-- For Friday schedules
UPDATE `schedules` 
SET `dayOfWeek` = 'FRIDAY', 
    `courseId` = `fridayCourseId`, 
    `teacherName` = `fridayTeacher`,
    `class` = 'Kelas Umum',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `fridayCourseId` IS NOT NULL;

-- Handle any remaining rows that didn't match any day (for example, lunch breaks)
UPDATE `schedules` 
SET `dayOfWeek` = 'MONDAY', 
    `courseId` = (SELECT id FROM courses LIMIT 1), 
    `teacherName` = 'Tidak Ada Guru',
    `class` = 'Tidak Ada Kelas',
    `academicYearId` = 'ACY001',
    `semesterId` = 'SEM001'
WHERE `dayOfWeek` IS NULL;

-- Now make the columns required
ALTER TABLE `schedules` 
    MODIFY COLUMN `academicYearId` VARCHAR(191) NOT NULL,
    MODIFY COLUMN `class` VARCHAR(191) NOT NULL,
    MODIFY COLUMN `courseId` VARCHAR(191) NOT NULL,
    MODIFY COLUMN `dayOfWeek` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    MODIFY COLUMN `semesterId` VARCHAR(191) NOT NULL,
    MODIFY COLUMN `teacherName` VARCHAR(191) NOT NULL;

-- Drop the old columns
ALTER TABLE `schedules` 
    DROP COLUMN `fridayCourseId`,
    DROP COLUMN `fridayTeacher`,
    DROP COLUMN `mondayCourseId`,
    DROP COLUMN `mondayTeacher`,
    DROP COLUMN `thursdayCourseId`,
    DROP COLUMN `thursdayTeacher`,
    DROP COLUMN `tuesdayCourseId`,
    DROP COLUMN `tuesdayTeacher`,
    DROP COLUMN `wednesdayCourseId`,
    DROP COLUMN `wednesdayTeacher`;

-- Create the unique index
CREATE UNIQUE INDEX `schedules_time_dayOfWeek_class_academicYearId_semesterId_key` ON `schedules`(`time`, `dayOfWeek`, `class`, `academicYearId`, `semesterId`);

-- Add the foreign key constraints
ALTER TABLE `semesters` ADD CONSTRAINT `semesters_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `schedules` ADD CONSTRAINT `schedules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `schedules` ADD CONSTRAINT `schedules_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `schedules` ADD CONSTRAINT `schedules_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `semesters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
