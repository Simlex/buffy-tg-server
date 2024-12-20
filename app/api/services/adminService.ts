import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";

export async function fetchBotUsers(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the passKey from the search params
  const passKey = searchParams.get("passkey");

  // If the passkey was not provided, throw an error
  if (!passKey || passKey !== process.env.PASSKEY) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Fetch all bot users
  const users = await prisma.users.findMany({
    select: {
      userId: true,
      username: true,
      totalPoints: true,
      referralCount: true,
      tonEarned: true,
      nftEarned: true,
      createdAt: true,
      tonSent: true,
      connectedWallets: {
        select: {
            walletAddress: true,
        }
      }
    },
    orderBy: {
      totalPoints: "desc",
    },
  });

  // Return all users
  return { data: users };
}

export async function restrictBotUser(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the passKey from the search params
  const passKey = searchParams.get("passkey");

  // If the passkey was not provided, throw an error
  if (!passKey || passKey !== process.env.PASSKEY) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Get the user id from the search params
  const userId = searchParams.get("userId");

  // If the user id was not provided, throw an error
  if (!userId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Update the user to be deleted
  await prisma.users.delete({
    where: {
      userId,
    },
  });

  // Return the success message
    return { data: "User restricted successfully" };
}