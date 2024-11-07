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

  diceRollsPoints?: number;
  tapPoints?: number;
  totalPoints?: number;
  triviaPoints?: number;
  dailyFreeBoosters?: number;
  dailyBoostersExp?: Date;
  boostRefillEndTime?: Date;

  agePoints?: number; // points earned from age verification
  messagesPoints?: number; // points earned from messages sent
  tonEarned?: number; // total ton earned
  nftEarned?: number; // total nft earned

  dailyFreeDiceRollsStreak?: number;
  dailyFreeDiceRollsClaimed?: boolean;
  dailyFreeDiceRollsExp?: Date | null;
  availableDiceRolls?: number;

  telegramTaskDone: boolean;
  twitterTaskDone: boolean;
  highestReferralBonusClaimed?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
