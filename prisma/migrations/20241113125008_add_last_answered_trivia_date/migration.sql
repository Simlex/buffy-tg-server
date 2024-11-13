/*
  Warnings:

  - You are about to drop the column `nextTriviaTime` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `nextTriviaTime`,
    ADD COLUMN `lastAnsweredTriviaDate` DATETIME(3) NULL;
