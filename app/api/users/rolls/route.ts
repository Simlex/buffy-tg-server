import { NextRequest, NextResponse } from "next/server";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { updateUserRollsPoints } from "../../services/rollsService";

// export async function GET(req: NextRequest) {
//   // Call the request validation method
//   await validateRequestMethod(req, "GET");

//   try {
//     // Call the function to fetch users
//     const operation = await fetchUsers(req);

//     // If the operation fails, return an error
//     if (operation.error) {
//       return customNextResponseError(operation);
//     }

//     // Return the response
//     return NextResponse.json(operation.data, { status: StatusCodes.Success });
//   } catch {
//     // Return an error if the operation fails
//     return NextResponse.json(
//       { error: ApplicationError.FailedToFetchUsers.Text },
//       { status: StatusCodes.InternalServerError }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "POST");

  try {
    // Call the createUser function
    const operation = await updateUserRollsPoints(req);

    // If the operation fails, return an error
    if (operation.error) { 
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch(error) {
    // Return an error if the operation fails
    return NextResponse.json(
      { error },
      { status: StatusCodes.InternalServerError }
    );
  }
}