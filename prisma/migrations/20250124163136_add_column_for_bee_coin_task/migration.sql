-- AlterTable
ALTER TABLE `Users` ADD COLUMN `joinedBeeCoinBot` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `joinedBeeCoinTg` BOOLEAN NOT NULL DEFAULT false;
