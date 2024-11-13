/*
  Warnings:

  - You are about to alter the column `nftEarned` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `tonEarned` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `nftEarned` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `tonEarned` DOUBLE NOT NULL DEFAULT 0.0;
