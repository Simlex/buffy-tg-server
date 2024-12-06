-- AlterTable
ALTER TABLE `Users` ADD COLUMN `diceSpin15Claimed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `diceSpin75Claimed` BOOLEAN NOT NULL DEFAULT false;
