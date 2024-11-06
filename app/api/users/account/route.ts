import { NextRequest, NextResponse } from "next/server";
import { validateRequestMethod } from "../../services/reusable-services/requestMethodValidator";
import { authenticateMTProto, getUserAccountAge } from "@/app/utilities/mtprotoClient";
import { StatusCodes } from "@/app/models/IStatusCodes";

export async function GET(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "GET");

  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  try {
    // Call the createUser function
    const operation = await getUserAccountAge(userId as string);

    // If the operation fails, return an error
    if (!operation) {
        return {
            error: "Failed to fetch user account information",
        }
    }

    // Return the response
    return NextResponse.json(operation, { status: StatusCodes.Success });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    // Return an error if the operation fails
    return NextResponse.json(
      { error },
      { status: StatusCodes.InternalServerError }
    );
  }
}