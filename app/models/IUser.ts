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
  referralContestCount?: number;
  isWalletConnected: boolean;
  hadMadeFirstTonTransaction: boolean;

  diceRollsPoints?: number;
  totalDiceRolls?: number;
  diceSpin15Claimed?: boolean;
  diceSpin75Claimed?: boolean;
  joinedErax: boolean;
  subscribedToZae: boolean;
  playedKolo: boolean;
  supportedTabiZooCollab: boolean;
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
  interactedWithTwitterPinnedPost: boolean;
  joinedTabiPartyDraw: boolean;
  joinedHarryCoinBot: boolean;
  joinedBeeCoinBot: boolean;
  joinedBeeCoinTg: boolean;
  websiteViewTaskDone: boolean;
  highestReferralBonusClaimed?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
