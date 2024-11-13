/*
  Warnings:

  - You are about to alter the column `nftEarned` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `tonEarned` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `nftEarned` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `tonEarned` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;
