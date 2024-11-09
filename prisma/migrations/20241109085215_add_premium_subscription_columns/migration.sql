-- AlterTable
ALTER TABLE `Users` ADD COLUMN `isSubscribedToPremium` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `premiumSubscriptionExp` DATETIME(3) NULL;
