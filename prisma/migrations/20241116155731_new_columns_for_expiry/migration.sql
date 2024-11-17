/*
  Warnings:

  - You are about to drop the column `dailyFreeDiceRollsExp` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `dailyFreeDiceRollsExp`,
    ADD COLUMN `dailyFreeDiceRollsNextClaimableDate` DATETIME(3) NULL,
    ADD COLUMN `dailyFreeDiceRollsNextClaimableDateExp` DATETIME(3) NULL;
