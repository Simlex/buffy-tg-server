/*
  Warnings:

  - You are about to drop the `referrals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `referrals`;

-- CreateTable
CREATE TABLE `Referrals` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `referredId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Referrals_userId_referredId_key`(`userId`, `referredId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
