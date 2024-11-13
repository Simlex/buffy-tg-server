import { NextRequest, NextResponse } from "next/server";
import { customNextResponseError } from "../../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { updateUserTriviaPoints } from "../../services/triviaService";

export async function POST(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "POST");

  try {
    // Call the updateUserTriviaPoints method
    const operation = await updateUserTriviaPoints(req);

    // If the operation fails, return an error
    if (operation.error) { 
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch(error) {
    console.log("🚀 ~ POST ~ error:", error)
    // Return an error if the operation fails
    return NextResponse.json(
      { error },
      { status: StatusCodes.InternalServerError }
    );
  }
}