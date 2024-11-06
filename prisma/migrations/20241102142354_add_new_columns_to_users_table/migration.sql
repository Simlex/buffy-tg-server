/*
  Warnings:

  - You are about to drop the column `points` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `points`,
    ADD COLUMN `diceRollsPoints` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tapPoints` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalPoints` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `triviaPoints` INTEGER NOT NULL DEFAULT 0;
