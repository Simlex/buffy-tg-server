import { ApplicationError } from "@/app/constants/applicationError";
import { TriviaConfig } from "@/app/constants/triviaConfig";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { TriviaUpdateRequest } from "@/app/models/ITrivia";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function updateUserTriviaPoints(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as TriviaUpdateRequest;

  // Use search params to get the userId
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  const userId = searchParams.get("userId");

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
      userId,
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

  const todayDate = new Date();
  const day = todayDate.getDate();
  const month = todayDate.getMonth();
  const year = todayDate.getFullYear();

  // if the user has already answered the trivia for the day, return an error
  if (user.lastAnsweredTriviaDate?.getDate() == todayDate.getDate() && user.lastAnsweredTriviaDate?.getMonth() == todayDate.getMonth() && user.lastAnsweredTriviaDate?.getFullYear() == todayDate.getFullYear()) {
    return {
      error: ApplicationError.UserAlreadyAnsweredTrivia.Text,
      errorCode: ApplicationError.UserAlreadyAnsweredTrivia.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // if there are no point provided, it means the user did not answer the trivia correctly
  // update the user's lastAnsweredTriviaDate and return
  if (!request.points || request.points == 0) {
    const updatedUser = await prisma.users.update({
      where: {
        userId: userId,
      },
      data: {
        lastAnsweredTriviaDate: todayDate,
      },
    });

    return { ...updatedUser };
  }

  // Update the user's trivia points
  const updatedUser = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      triviaPoints: {
        increment: request.points,
      },
      totalPoints: {
        increment: request.points,
      },
      lastAnsweredTriviaDate: todayDate,
    },
  });

  // Return the response
  return { ...updatedUser };
}
