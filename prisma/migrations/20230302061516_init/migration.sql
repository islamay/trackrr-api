-- AlterTable
ALTER TABLE `attendance` MODIFY `checkedInTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `checkedOutTime` DATETIME(3) NULL;
