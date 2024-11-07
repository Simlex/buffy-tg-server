-- AlterTable
ALTER TABLE `Users` ADD COLUMN `availableDiceRolls` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `dailyFreeDiceRollsClaimed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `dailyFreeDiceRollsExp` DATETIME(3) NULL,
    ADD COLUMN `dailyFreeDiceRollsStreak` INTEGER NOT NULL DEFAULT 0;
