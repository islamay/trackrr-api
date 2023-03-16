-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_workshiftMemberId_fkey` FOREIGN KEY (`workshiftMemberId`) REFERENCES `WorkshiftMember`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
