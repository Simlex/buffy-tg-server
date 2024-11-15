import { ApplicationError } from "@/app/constants/applicationError";
import { RollsPurchasesConfig } from "@/app/constants/purchases";
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
        increment: diceRolls,
      },
      tonEarned: {
        increment: request.ton ?? 0,
      },
      nftEarned: {
        increment: request.nft ?? 0,
      },
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

  // check if the user has not waited for 24 hours
  const expiryDateIsInFuture =
    user.dailyFreeDiceRollsExp &&
    new Date(user.dailyFreeDiceRollsExp) > new Date();

  // check if the user is a premium user
  const isPremiumUser = user.isSubscribedToPremium;

  // check if the user is still within their premium subscription period
  const isWithinPremiumSubscriptionPeriod =
    isPremiumUser &&
    user.premiumSubscriptionExp &&
    new Date(user.premiumSubscriptionExp) > new Date();

  // assign a variable that specifies that a user is a valid premium user
  const isValidPremiumUser = isPremiumUser && isWithinPremiumSubscriptionPeriod;

  // check if the user has already claimed the daily free dice roll, and they have not waited for 24 hours
  if (user.dailyFreeDiceRollsClaimed && expiryDateIsInFuture) {
    return {
      error: ApplicationError.DailyFreeDiceRollAlreadyClaimed.Text,
      errorCode: ApplicationError.DailyFreeDiceRollAlreadyClaimed.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // if we get here, it means the user has not claimed his or her daily roll

  // get the date the streak would expire - 24 hours from the time the user claimed the roll
  const streakExpiryDate = new Date().setHours(new Date().getHours() + 24);
  console.log(
    "🚀 ~ updateUserDailyRollStreak ~ streakExpiryDate:",
    streakExpiryDate
  );

  // check if streak has expired
  const streakHasExpired =
    user.dailyFreeDiceRollsExp &&
    new Date(user.dailyFreeDiceRollsExp) < new Date();

  const premiumUserRolls = 4;
  const normalUserRolls = 1;

  // Update the user's dice roll points
  const updatedUser = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      dailyFreeDiceRollsStreak: streakHasExpired
        ? 1
        : {
            increment: 1,
          },
      availableDiceRolls: streakHasExpired
        ? {
            increment: isValidPremiumUser ? premiumUserRolls : normalUserRolls,
          }
        : {
            increment: isValidPremiumUser
              ? premiumUserRolls + user.dailyFreeDiceRollsStreak
              : normalUserRolls + user.dailyFreeDiceRollsStreak,
          },
      dailyFreeDiceRollsExp: {
        set: new Date(streakExpiryDate),
      },
      dailyFreeDiceRollsClaimed: true,
    },
  });

  // Return the response
  return { ...updatedUser };
}
