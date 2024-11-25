// import { ApplicationError } from "@/app/constants/applicationError";
// import { PointsUpdateRequest } from "@/app/models/IPoints";
// import { StatusCodes } from "@/app/models/IStatusCodes";
// import { prisma } from "@/lib/prisma";
// import { NextRequest } from "next/server";

// /**
//  * Function to update the user's subscription status //* Can be used to update the user's subscription status
//  * @param req is the request object
//  * @returns the updated user object
//  */
// export async function updateUserSubscription(req: NextRequest) {
//   // Get the body of the request
//   const request = (await req.json()) as PointsUpdateRequest;

//   // Check if all required fields are provided
//   if (!request.userId) {
//     return {
//       error: ApplicationError.MissingRequiredParameters.Text,
//       statusCode: StatusCodes.BadRequest,
//     };
//   }

//   // Check if user exists
//   const user = await prisma.users.findUnique({
//     where: {
//       userId: request.userId,
//     },
//   });

//   // If user does not exists, return error
//   if (!user) {
//     return {
//       error: ApplicationError.UserWithIdNotFound.Text,
//       errorCode: ApplicationError.UserWithIdNotFound.Code,
//       statusCode: StatusCodes.NotFound,
//     };
//   }

//   // set the expiry date for the premium subscription if the user is subscribing to premium to be a month from the current date
//   const premiumSubscriptionExpiryDate = new Date().setMonth(
//     new Date().getMonth() + 1
//   );

//   // Update the user's premium subscription status
//   const updatedUser = await prisma.users.update({
//     where: {
//       userId: request.userId,
//     },
//     data: {
//       isSubscribedToPremium: request.forPremiumSubscription,
//       premiumSubscriptionExp: request.forPremiumSubscription
//         ? new Date(premiumSubscriptionExpiryDate)
//         : user.premiumSubscriptionExp,
//       availableDiceRolls: {
//         increment: 4,
//       },
//     },
//   });

//   // Return the response
//   return { ...updatedUser };
// }