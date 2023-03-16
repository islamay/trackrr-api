/*
  Warnings:

  - Added the required column `workshiftId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `workshiftId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_workshiftId_fkey` FOREIGN KEY (`workshiftId`) REFERENCES `Workshift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
