/*
  Warnings:

  - You are about to drop the column `expiredIn` on the `invitation` table. All the data in the column will be lost.
  - Added the required column `expiresIn` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `expiredIn`,
    ADD COLUMN `expiresIn` DATETIME(3) NOT NULL;
