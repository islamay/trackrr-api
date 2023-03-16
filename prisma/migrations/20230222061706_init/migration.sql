/*
  Warnings:

  - You are about to alter the column `workingStart` on the `workshift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `workingEnd` on the `workshift` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `workshift` MODIFY `workingStart` DATETIME(3) NOT NULL,
    MODIFY `workingEnd` DATETIME(3) NOT NULL;
