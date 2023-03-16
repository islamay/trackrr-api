/*
  Warnings:

  - You are about to alter the column `token` on the `session` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `TinyText`.

*/
-- AlterTable
ALTER TABLE `session` MODIFY `token` TINYTEXT NOT NULL;
