export interface UserProfileInformation {
  id: string;
  userId: string;
  username: string;
  email?: string;
  emailVerified?: boolean;
  role?: string;
  level: number;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  phone?: string;
  referralCode?: string;
  referralCount?: number;
  isWalletConnected: boolean;
  hadMadeFirstTonTransaction: boolean;

  diceRollsPoints?: number;
  tapPoints?: number;
  totalPoints?: number;
  triviaPoints?: number;
  lastAnsweredTriviaDate?: Date;
  dailyFreeBoosters?: number;
  dailyBoostersExp?: Date;
  boostRefillEndTime?: Date;

  agePoints?: number; // points earned from age verification
  messagesPoints?: number; // points earned from messages sent
  tonEarned?: number; // total ton earned
  nftEarned?: number; // total nft earned

  dailyFreeDiceRollsStreak?: number;
  dailyFreeDiceRollsClaimed?: boolean;
  dailyFreeDiceRollsNextClaimableDateExp?: Date | null;
  availableDiceRolls?: number;

  isSubscribedToPremium?: boolean;
  premiumSubscriptionExp?: Date;

  telegramTaskDone: boolean;
  twitterTaskDone: boolean;
  websiteViewTaskDone: boolean;
  highestReferralBonusClaimed?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
