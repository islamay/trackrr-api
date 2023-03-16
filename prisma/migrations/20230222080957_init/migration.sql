-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_workshiftId_fkey`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_workshiftMemberId_fkey`;

-- DropForeignKey
ALTER TABLE `companymember` DROP FOREIGN KEY `CompanyMember_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `companymember` DROP FOREIGN KEY `CompanyMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `track` DROP FOREIGN KEY `Track_attendanceId_fkey`;

-- DropForeignKey
ALTER TABLE `workshift` DROP FOREIGN KEY `Workshift_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `workshiftmember` DROP FOREIGN KEY `WorkshiftMember_companyMemberId_fkey`;

-- DropForeignKey
ALTER TABLE `workshiftmember` DROP FOREIGN KEY `WorkshiftMember_workshiftId_fkey`;

-- AddForeignKey
ALTER TABLE `CompanyMember` ADD CONSTRAINT `CompanyMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyMember` ADD CONSTRAINT `CompanyMember_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workshift` ADD CONSTRAINT `Workshift_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkshiftMember` ADD CONSTRAINT `WorkshiftMember_workshiftId_fkey` FOREIGN KEY (`workshiftId`) REFERENCES `Workshift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkshiftMember` ADD CONSTRAINT `WorkshiftMember_companyMemberId_fkey` FOREIGN KEY (`companyMemberId`) REFERENCES `CompanyMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_workshiftId_fkey` FOREIGN KEY (`workshiftId`) REFERENCES `Workshift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_workshiftMemberId_fkey` FOREIGN KEY (`workshiftMemberId`) REFERENCES `WorkshiftMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `Attendance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
