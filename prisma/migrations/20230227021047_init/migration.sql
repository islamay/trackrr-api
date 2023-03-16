/*
  Warnings:

  - You are about to drop the column `expiresIn > now()` on the `invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `expiresIn > now()`,
    ADD COLUMN `expiresIn <= now()` BOOLEAN NOT NULL DEFAULT false;
