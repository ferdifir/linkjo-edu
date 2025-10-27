-- AlterTable
ALTER TABLE `academic_years` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `schedules` ADD COLUMN `classroomId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `semesters` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classrooms` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 30,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `classrooms_code_key`(`code`),
    UNIQUE INDEX `classrooms_locationId_code_key`(`locationId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_classroomId_fkey` FOREIGN KEY (`classroomId`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
