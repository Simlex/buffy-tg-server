import { ApplicationError } from "@/app/constants/applicationError";
import { RollsPurchasesConfig } from "@/app/constants/purchases";
import { PointsUpdateRequest } from "@/app/models/IPoints";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function updateUserRollsPoints(req: NextRequest) {
    // Get the body of the request
    const request = (await req.json()) as PointsUpdateRequest;
  
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
    const diceRolls = RollsPurchasesConfig.find(purchase => purchase.tonPrice === request.ton)?.roll || 0;
  
    // Update the user's dice roll points
    const updatedUser = await prisma.users.update({
      where: {
        userId: request.userId,
      },
      data: {
        isSubscribedToPremium: request.forPremiumSubscription,
        availableDiceRolls: {
            increment: diceRolls
        },
      },
    });
  
    // Return the response
    return { ...updatedUser };
  }