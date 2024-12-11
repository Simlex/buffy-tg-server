-- AlterTable
ALTER TABLE `Users` ADD COLUMN `tonSent` DOUBLE NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE `ConnectedWallets` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `walletType` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConnectedWallets_userId_key`(`userId`),
    UNIQUE INDEX `ConnectedWallets_userId_walletAddress_key`(`userId`, `walletAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConnectedWallets` ADD CONSTRAINT `ConnectedWallets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
