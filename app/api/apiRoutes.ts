/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:4055/";
//   static BASE_URL_DEV: string = "http://192.168.1.226:4040/";
//   static BASE_URL_DEV: string = "https://2c10-41-184-8-14.ngrok-free.app/";

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
}
