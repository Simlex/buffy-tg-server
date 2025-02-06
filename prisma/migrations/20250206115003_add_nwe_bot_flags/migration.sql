-- AlterTable
ALTER TABLE `Users` ADD COLUMN `joinedOptimusXBot` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `joinedRoarBot` BOOLEAN NOT NULL DEFAULT false;
