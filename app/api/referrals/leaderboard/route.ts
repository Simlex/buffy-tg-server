import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { ApplicationError } from "@/app/constants/applicationError";
import { fetchReferralsLeaderboard } from "../../services/referralService";
import { customNextResponseError } from "../../utils/customNextResponseError";

export async function GET(req: NextRequest) {
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch referrals leaderboard
    const operation = await fetchReferralsLeaderboard();

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchUsers.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
