-- AlterTable
ALTER TABLE `invitation` ADD COLUMN `expiresIn > now()` BOOLEAN NOT NULL DEFAULT false;
