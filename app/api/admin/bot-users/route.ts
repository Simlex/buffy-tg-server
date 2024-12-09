import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { restrictBotUser } from "../../services/adminService";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";

export async function DELETE(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "DELETE");

  try {
    // Call the function to restrict bot user
    const operation = await restrictBotUser(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToRestrictUser.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
