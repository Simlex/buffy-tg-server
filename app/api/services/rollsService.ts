import { ApplicationError } from "@/app/constants/applicationError";
import { RollsPurchasesConfig } from "@/app/constants/purchases";
import { RollsStreakConfig } from "@/app/constants/rollsStreakConfig";
import { PointsUpdateRequest } from "@/app/models/IPoints";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function updateUserRollsPoints(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as PointsUpdateRequest;
  console.log("🚀 ~ updateUserRollsPoints ~ request:", request);

  // Check if all required fields are provided
  if (!request.userId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user exists
  const user = await prisma.users.findUnique({
    where: {
      userId: request.userId,
    },
  });

  // If user does not exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // get the dice rolls the user gets from this purchase
  const diceRolls =
    RollsPurchasesConfig.find((purchase) => purchase.tonPrice === request.ton)
      ?.roll || 0;

  // set the expiry date for the premium subscription if the user is subscribing to premium to be a month from the current date
  const premiumSubscriptionExpiryDate = new Date().setMonth(
    new Date().getMonth() + 1
  );

  // Update the user's dice roll points
  const updatedUser = await prisma.users.update({
    where: {
      userId: request.userId,
    },
    data: {
      isSubscribedToPremium: request.forPremiumSubscription,
      premiumSubscriptionExp: request.forPremiumSubscription
        ? new Date(premiumSubscriptionExpiryDate)
        : user.premiumSubscriptionExp,
      availableDiceRolls: {
        increment: request.forPremiumSubscription ? RollsStreakConfig.Premium : diceRolls,
      },
      tonSent: {
        increment: request.ton,
      }
    //   tonEarned: {
    //     increment: request.forPremiumSubscription ? 0 : request.ton ?? 0,
    //   },
    //   nftEarned: {
    //     increment: request.forPremiumSubscription ? 0 : request.nft ?? 0,
    //   },
    },
  });

  // Return the response
  return { ...updatedUser };
}

export async function updateUserDailyRollStreak(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId") as string;
  console.log("🚀 ~ updateUserDailyRollStreak ~ userId:", userId);

  // Check if all required fields are provided
  if (!userId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user exists
  const user = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
  });

  // If user does not exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Check current date against claimable and expiry times
  const now = new Date();
  const withinClaimablePeriod =
    user.dailyFreeDiceRollsNextClaimableDate &&
    new Date(user.dailyFreeDiceRollsNextClaimableDate) <= now &&
    (!user.dailyFreeDiceRollsNextClaimableDateExp ||
      now < new Date(user.dailyFreeDiceRollsNextClaimableDateExp));
  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ withinClaimablePeriod:",
    withinClaimablePeriod
  );

  // Check if dates are in the past
  const claimableDateInPast =
    user.dailyFreeDiceRollsNextClaimableDate &&
    new Date(user.dailyFreeDiceRollsNextClaimableDate) < now;
  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ claimableDateInPast:",
    claimableDateInPast
  );

  const streakClaimExpiryDateInPast =
    user.dailyFreeDiceRollsNextClaimableDateExp &&
    new Date(user.dailyFreeDiceRollsNextClaimableDateExp) < now;
  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ streakClaimExpiryDateInPast:",
    streakClaimExpiryDateInPast
  );

  // Handle resetting streak if dates are in the past
  const streakHasExpired = claimableDateInPast && streakClaimExpiryDateInPast;
  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ streakHasExpired:",
    streakHasExpired
  );

  // check if the user is a premium user
  const isPremiumUser = user.isSubscribedToPremium;

  // check if the user is still within their premium subscription period
  const isWithinPremiumSubscriptionPeriod =
    isPremiumUser &&
    user.premiumSubscriptionExp &&
    new Date(user.premiumSubscriptionExp) > new Date();

  // A valid premium user is one who is both subscribed to premium and within the premium subscription period
  const isValidPremiumUser = isPremiumUser && isWithinPremiumSubscriptionPeriod;

  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ user.dailyFreeDiceRollsClaimed:",
    user.dailyFreeDiceRollsClaimed
  );
  // check if the user has already claimed the daily free dice roll, and still within the claimable period
  if (
    !streakHasExpired &&
    user.dailyFreeDiceRollsClaimed &&
    !withinClaimablePeriod
  ) {
    return {
      error: ApplicationError.DailyFreeDiceRollAlreadyClaimed.Text,
      errorCode: ApplicationError.DailyFreeDiceRollAlreadyClaimed.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If we get here, it means the user hasn’t claimed their daily roll, so we can proceed with updating their streak

  // calculate the next claimable date which is 1am of the next day
  const nextClaimableDate = new Date();
  nextClaimableDate.setDate(nextClaimableDate.getDate() + 1);
  nextClaimableDate.setHours(0, 1, 0, 0); // Sets time to 12:01 AM

  // get the date the streak would expire - 11:59pm of the next day
  const streakExpiryDate = new Date();
  streakExpiryDate.setDate(streakExpiryDate.getDate() + 1);
  streakExpiryDate.setHours(23, 59, 0, 0); // Sets time to 11:59 PM

  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ streakExpiryDate:",
    streakExpiryDate
  );

  // check if streak has expired
  //   const streakHasExpired =
  //     !withinClaimablePeriod &&
  //     user.dailyFreeDiceRollsNextClaimableDateExp &&
  //     new Date(user.dailyFreeDiceRollsNextClaimableDateExp) < now;

  // Define rolls for premium and normal users
  const premiumUserRolls = RollsStreakConfig.Premium;
  const normalUserRolls = RollsStreakConfig.Normal;

  // Calculate the dice rolls to be awarded based on whether the streak has expired and if the user is premium
  const rollsToAward = streakHasExpired
    ? isValidPremiumUser
      ? premiumUserRolls
      : normalUserRolls
    : isValidPremiumUser
    ? premiumUserRolls + normalUserRolls + user.dailyFreeDiceRollsStreak
    : normalUserRolls + user.dailyFreeDiceRollsStreak;

  // Update the user's dice roll points
  const updatedUser = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      dailyFreeDiceRollsStreak: streakHasExpired ? 1 : { increment: 1 },
      availableDiceRolls: { increment: rollsToAward },
      dailyFreeDiceRollsNextClaimableDate: { set: nextClaimableDate },
      dailyFreeDiceRollsNextClaimableDateExp: { set: streakExpiryDate },
      dailyFreeDiceRollsClaimed: true,
    },
  });

  // Return the response
  return { ...updatedUser };
}
