/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:4055/";
  //   static BASE_URL_DEV: string = "http://192.168.1.226:4040/";
  // static BASE_URL_DEV: string = "https://4dc8-102-88-36-243.ngrok-free.app/";

  /**
   * The test base url for the application
   */
  static BASE_URL_TEST: string = "https://buffy-tg-server.vercel.app/";

  /**
   * The live base url for the application
   */
  static BASE_URL_LIVE: string = "https://buffy-tg-server.vercel.app/";

  /**
   * The route to Users endpoint
   */
  static Users: string = "api/users";

  /**
   * The route to Users Account endpoint
   */
  //   static UsersAccount: string = "api/users/account";

  /**
   * The route to Users Daily Boosts endpoint
   */
  static UsersDailyBoosts: string = "api/users/dailyboosts";

  /**
   * The route to Users Rolls endpoint
   */
  static UsersRolls: string = "api/users/rolls";

  /**
   * The route to Users Rolls Streak endpoint
   */
  static UsersRollsStreak: (userId: string) => string = (userId: string) =>
    `api/rolls/streak?userId=${userId}`;

  /**
   * The route to Users Trivia endpoint
   */
  static UsersTrivia: (userId: string) => string = (userId: string) =>
    `api/users/trivia?userId=${userId}`;

  /**
   * The route to Users Multitap endpoint
   */
  static UsersMultiLevels: string = "api/users/multilevels";

  /**
   * The route to Boost Refill End Time endpoint
   */
  static UsersBoostRefillEndTime: string = "api/users/boost-refill";

  /**
   * The route to Points endpoint
   */
  static Points: string = "api/points";

  /**
   * The route to Referral endpoint
   */
  static Referrals: string = "api/referrals";

  /**
   * The route to Referral bonus endpoint
   */
  static ReferralBonus: string = "api/referrals/bonus";

  /**
   * The route to Leaderboard endpoint
   */
  static Leaderboard: string = "api/leaderboard";

  /**
   * The route to admin endpoint
   */
  static Admin: (passkey: string) => string = (passkey: string) =>
    `api/admin?passkey=${passkey}`;
}
