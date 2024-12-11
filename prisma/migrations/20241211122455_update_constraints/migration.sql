/*
  Warnings:

  - A unique constraint covering the columns `[walletType,walletAddress]` on the table `ConnectedWallets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ConnectedWallets_userId_walletAddress_key` ON `ConnectedWallets`;

-- CreateIndex
CREATE UNIQUE INDEX `ConnectedWallets_walletType_walletAddress_key` ON `ConnectedWallets`(`walletType`, `walletAddress`);
