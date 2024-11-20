-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `level` INTEGER NOT NULL DEFAULT 1,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `referralCode` VARCHAR(191) NOT NULL,
    `referralCount` INTEGER NOT NULL DEFAULT 0,
    `isWalletConnected` BOOLEAN NOT NULL DEFAULT false,
    `hadMadeFirstTonTransaction` BOOLEAN NOT NULL DEFAULT false,
    `tapPoints` INTEGER NOT NULL DEFAULT 0,
    `totalPoints` INTEGER NOT NULL DEFAULT 0,
    `diceRollsPoints` INTEGER NOT NULL DEFAULT 0,
    `totalDiceRolls` INTEGER NOT NULL DEFAULT 0,
    `triviaPoints` INTEGER NOT NULL DEFAULT 0,
    `lastAnsweredTriviaDate` DATETIME(3) NULL,
    `agePoints` INTEGER NOT NULL DEFAULT 0,
    `messagesPoints` INTEGER NOT NULL DEFAULT 0,
    `tonEarned` DOUBLE NOT NULL DEFAULT 0.0,
    `nftEarned` DOUBLE NOT NULL DEFAULT 0.0,
    `dailyFreeBoosters` INTEGER NOT NULL DEFAULT 4,
    `boostRefillEndTime` DATETIME(3) NULL,
    `dailyBoostersExp` DATETIME(3) NULL,
    `dailyFreeDiceRollsStreak` INTEGER NOT NULL DEFAULT 0,
    `dailyFreeDiceRollsClaimed` BOOLEAN NOT NULL DEFAULT false,
    `dailyFreeDiceRollsNextClaimableDate` DATETIME(3) NULL,
    `dailyFreeDiceRollsNextClaimableDateExp` DATETIME(3) NULL,
    `availableDiceRolls` INTEGER NOT NULL DEFAULT 0,
    `isSubscribedToPremium` BOOLEAN NOT NULL DEFAULT false,
    `premiumSubscriptionExp` DATETIME(3) NULL,
    `telegramTaskDone` BOOLEAN NOT NULL DEFAULT false,
    `twitterTaskDone` BOOLEAN NOT NULL DEFAULT false,
    `highestReferralBonusClaimed` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_userId_key`(`userId`),
    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_referralCode_key`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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