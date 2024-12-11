export interface BotUser {
  userId: string;
  username: string;
  totalPoints: string;
  tonEarned: string;
  nftEarned: string;
  createdAt: string;
  referralCount: string;
  tonSent: string;
  connectedWallets: {
    walletAddress: string;
  }[];
}