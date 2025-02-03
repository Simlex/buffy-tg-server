import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { UserProfileInformation } from "@/app/models/IUser";
import { PointsUpdateRequest } from "@/app/models/IPoints";
import { Task } from "@/app/enums/ITask";
import { MultiLevelRequest } from "@/app/models/ILevel";
import { levels } from "@/app/constants/levels";
import { dailyBoostLimit } from "@/app/constants/user";
import { Game } from "@/app/enums/Game";
import { PointsConfig } from "@/app/constants/globalPointsConfig";

export async function createUser(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as UserProfileInformation;

  // Check if all required fields are provided
  if (!request.userId || !request.username) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user already exists
  const user = await prisma.users.findUnique({
    where: {
      userId: request.userId,
    },
  });

  // If user exists, return message
  if (user) {
    return { user };
  }

  // If user does not exist, create a new user...
  const newUser = await prisma.users.create({
    data: {
      userId: `${request.userId}`,
      username: request.username,
      referralCode: `${request.username}${request.userId}`,
    },
  });

  // Return the response
  return { newUser };
}

export async function fetchUsers(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // If a userId is provided, find the user with that id
  if (userId) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // If user is not found, return 404
    if (!user) {
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If user is found, return it
    return { data: user };
  }

  // Fetch all users
  const users = await prisma.users.findMany({
    orderBy: {
      totalPoints: "desc",
    },
  });

  // Return all users
  return { data: users };
}

export async function updateUserPoints(req: NextRequest) {
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

  // If a specific task was provided, check if the task has not been done yet
  if (request.task) {
    const specifiedTask = request.task;

    // If the specified task is telegram
    if (specifiedTask === Task.TELEGRAM) {
      // If the user has done the task, show error
      if (user.telegramTaskDone) {
        return {
          error: ApplicationError.TelegramTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TelegramTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          telegramTaskDone: true,
        },
      });
    }

    // If the specified task is to join erax
    if (specifiedTask === Task.JOIN_ERAX) {
      // If the user has done the task, show error
      if (user.joinedErax) {
        return {
          error: ApplicationError.EraxTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.EraxTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          joinedErax: true,
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is to play kolo
    if (specifiedTask === Task.PLAY_KOLO_BLOCK) {
      // If the user has done the task, show error
      if (user.playedKolo) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          playedKolo: true,
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is to subscribe to Zae
    if (specifiedTask === Task.ZAE_CRYPTO_SUBSCRIPTION) {
      // If the user has done the task, show error
      if (user.subscribedToZae) {
        return {
          error: ApplicationError.ZaeSubTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.ZaeSubTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's zae sub task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          subscribedToZae: true,
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is twitter and the user has done the task, show error
    if (specifiedTask === Task.TWITTER) {
      // If the user has done the task, show error
      if (user.twitterTaskDone) {
        return {
          error: ApplicationError.TwitterTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TwitterTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          twitterTaskDone: true,
        },
      });
    }

    // If the specified task is interact with pinned tweet and the user has done the task, show error
    if (specifiedTask === Task.INTERACT_WITH_TWITTER_PINNED_POST) {
      // If the user has done the task, show error
      if (user.interactedWithTwitterPinnedPost) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          interactedWithTwitterPinnedPost: true,
        },
      });
    }

    // If the specified task is join tabi party draw and the user has done the task, show error
    if (specifiedTask === Task.JOIN_TABI_PARTY_DRAW) {
      // If the user has done the task, show error
      if (user.joinedTabiPartyDraw) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          joinedTabiPartyDraw: true,
          availableDiceRolls: {
            increment: PointsConfig.JoinedTabiPartyDraw.rolls,
          }
        },
      });
    }

    // If the specified task is join bee coin bot and the user has done the task, show error
    if (specifiedTask === Task.JOIN_BEE_COIN_BOT) {
      // If the user has done the task, show error
      if (user.joinedBeeCoinBot) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          joinedBeeCoinBot: true
        },
      });
    }

    // If the specified task is join harry coin bot and the user has done the task, show error
    if (specifiedTask === Task.JOIN_HARRY_COIN_BOT) {
      // If the user has done the task, show error
      if (user.joinedHarryCoinBot) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          joinedHarryCoinBot: true
        },
      });
    }

    // If the specified task is join bee coin tg and the user has done the task, show error
    if (specifiedTask === Task.JOIN_BEE_COIN_TG) {
      // If the user has done the task, show error
      if (user.joinedBeeCoinTg) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's telegram task status
      await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          joinedBeeCoinTg: true
        },
      });
    }

    // If the specified task is ton transaction
    if (specifiedTask === Task.TON_TRANSACTION) {
      // If the user has done the task, show error
      if (user.hadMadeFirstTonTransaction) {
        return {
          error: ApplicationError.TonTransactionTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TonTransactionTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.isWalletConnected
          ? user.totalPoints
          : user.totalPoints + PointsConfig.WalletConnectPoints
      );

      // update the user's telegram task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          hadMadeFirstTonTransaction: true,
          isWalletConnected: user.isWalletConnected || true,
          tonSent: {
            increment: request.ton,
          },
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is support tabi zoo collaboration
    if (specifiedTask === Task.SUPPORT_TABI_ZOO_COLLAB) {
      // If the user has done the task, show error
      if (user.supportedTabiZooCollab) {
        return {
          error: ApplicationError.TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.isWalletConnected
          ? user.totalPoints
          : user.totalPoints + PointsConfig.WalletConnectPoints
      );

      // update the user's tabi zoo collab task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          supportedTabiZooCollab: true,
          isWalletConnected: user.isWalletConnected || true,
          tonSent: {
            increment: request.ton,
          },
          availableDiceRolls: {
            increment: PointsConfig.TabiZooCollaboration.rolls,
          }
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is wallet connect
    if (specifiedTask === Task.WALLET_CONNECT) {
      // If the user has done the task, show error
      if (user.isWalletConnected) {
        return {
          error: ApplicationError.WalletConnectTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.WalletConnectTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's wallet connect task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          isWalletConnected: true,
        },
      });

      await addWallet({
        userId: request.userId,
        walletAddress: request.walletAddress as string,
        walletType: "TON",
      });

      return { ...updatedUser };
    }

    // If the specified task is view website
    if (specifiedTask === Task.WEBSITE_VIEW) {
      // If the user has done the task, show error
      if (user.websiteViewTaskDone) {
        return {
          error: ApplicationError.WebsiteViewTaskAlreadyCompleted.Text,
          errorCode: ApplicationError.WebsiteViewTaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's website view task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          websiteViewTaskDone: true,
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is dice spin 15
    if (specifiedTask === Task.DICE_SPIN_15) {
      // if the total dice rolls of the user is not up to 15, show error
      if (user.totalDiceRolls < 15) {
        return {
          error: ApplicationError.NotEnoughDiceRolls.Text,
          errorCode: ApplicationError.NotEnoughDiceRolls.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // If the user has done the task, show error
      if (user.diceSpin15Claimed) {
        return {
          error: ApplicationError.DiceSpin15TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.DiceSpin15TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // decrement the user's total dice rolls
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          totalDiceRolls: {
            decrement: 15,
          },
          diceSpin15Claimed: true,
        },
      });

      return { ...updatedUser };
    }

    // If the specified task is dice spin 75
    if (specifiedTask === Task.DICE_SPIN_75) {
      // if the total dice rolls of the user is not up to 75, show error
      if (user.totalDiceRolls < 75) {
        return {
          error: ApplicationError.NotEnoughDiceRolls.Text,
          errorCode: ApplicationError.NotEnoughDiceRolls.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // If the user has done the task, show error
      if (user.diceSpin75Claimed) {
        return {
          error: ApplicationError.DiceSpin75TaskAlreadyCompleted.Text,
          errorCode: ApplicationError.DiceSpin75TaskAlreadyCompleted.Code,
          statusCode: StatusCodes.BadRequest,
        };
      }

      // if we get here, it means the user has not done the task...

      // increment the user's points
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // decrement the user's total dice rolls
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          totalDiceRolls: {
            decrement: 75,
          },
          diceSpin75Claimed: true,
        },
      });

      return { ...updatedUser };
    }

    // Return the response
    return { message: "Successfully updated user's point & task status" };
  }

  // Check if the user provided a particular game
  if (request.game) {
    const specifiedGame = request.game;

    // If the specified game is dice
    if (specifiedGame === Game.Dice) {
      // If the user rolled a 4, 5, or 6
      if (request.ton) {
        // update the user's ton balance
        await prisma.users.update({
          where: {
            userId: request.userId,
          },
          data: {
            tonEarned: {
              increment: request.ton,
            },
          },
        });

        // Return the response
        // return { ...updatedUser };
      }

      // If the user rolled a 6
      if (request.nft) {
        // update the user's nft balance
        await prisma.users.update({
          where: {
            userId: request.userId,
          },
          data: {
            nftEarned: {
              increment: request.nft,
            },
          },
        });

        // Return the response
        // return { ...updatedUser };
      }

      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's dice task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          diceRollsPoints: {
            increment: request.points,
          },
          totalDiceRolls: {
            increment: request.diceRollsUsed,
          },
          availableDiceRolls: {
            decrement: request.diceRollsUsed,
          },
        },
      });

      // Return the response
      return { ...updatedUser };
    }

    // If the specified game is tap
    if (specifiedGame === Game.Tap) {
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's tap task status
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          tapPoints: {
            increment: request.points,
          },
        },
      });

      // Return the response
      return { ...updatedUser };
    }
  }

  const accountMetrics = request.accountMetrics;

  // Check if the user is a new user => for account metrics (age & message)
  if (accountMetrics) {
    if (accountMetrics === "age") {
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's age
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          agePoints: {
            increment: request.points,
          },
        },
      });
      console.log("🚀 ~ updateUserPoints ~ updatedUser:", updatedUser);

      // Return the response
      return { ...updatedUser };
    }
    if (accountMetrics === "messages") {
      await incrementUserTotalPoints(
        request.points,
        request.userId,
        user.totalPoints
      );

      // update the user's age
      const updatedUser = await prisma.users.update({
        where: {
          userId: request.userId,
        },
        data: {
          messagesPoints: {
            increment: request.points,
          },
        },
      });
      console.log("🚀 ~ updateUserPoints ~ updatedUser:", updatedUser);

      // Return the response
      return { ...updatedUser };
    }
  }

  // Update the user's points
  const updatedUser = await prisma.users.update({
    where: {
      userId: request.userId,
    },
    data: {
      totalPoints: {
        increment: request.points,
      },
    },
  });

  // Return the response
  return { ...updatedUser };
}

// async function fetchUserByUserId(userId: string) {
//   const user = await prisma.users.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   // If user is not found, return 404
//   if (!user) {
//     return {
//       error: ApplicationError.UserWithIdNotFound.Text,
//       errorCode: ApplicationError.UserWithIdNotFound.Code,
//       statusCode: StatusCodes.NotFound,
//     };
//   }

//   // If user is found, return it
//   return { user };
// }

export async function fetchLeaderboard() {
  // Fetch all users
  const users = await prisma.users.findMany({
    orderBy: {
      // order by points in descending order
      totalPoints: "desc",
    },
    take: 100,
  });

  // Compose the leaderboard
  const leaderboard = users.map((user, index) => {
    return {
      rank: index + 1,
      username: user.username,
      totalPoints: user.totalPoints,
    };
  });

  // Return all users
  return { data: leaderboard };
}

export async function updateFreeDailyBoosters(req: NextRequest) {
  // Use search params to get the userId
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  const userId = searchParams.get("userId");

  const mode = searchParams.get("mode");

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

  // If user exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  if (mode === "fetch") {
    // If the expiration date is in the past, reset the user's free daily boosters
    if (
      (user.dailyBoostersExp && user.dailyBoostersExp < new Date()) ||
      user.dailyFreeBoosters > dailyBoostLimit
    ) {
      const updatedUser = await prisma.users.update({
        where: {
          userId: userId,
        },
        data: {
          dailyFreeBoosters: dailyBoostLimit,
          dailyBoostersExp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return {
        message: "Successfully updated user's free daily boosters",
        data: updatedUser,
      };
    } else {
      return {
        message: "Successfully fetched user's free daily boosters",
        data: user,
      };
    }
  }

  // if we are updating the user's free daily boosters...

  // Check if user has no free daily boosters and the expiration date is in the future
  if (
    user.dailyFreeBoosters <= 0 &&
    user.dailyBoostersExp &&
    user.dailyBoostersExp > new Date()
  ) {
    // We can not give the user more free daily boosters today
    return {
      error: ApplicationError.NoFreeBoosters.Text,
      errorCode: ApplicationError.NoFreeBoosters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Update the user's free daily boosters and expiration date
  const updatedUser = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      dailyFreeBoosters: {
        decrement: 1,
      },
      // set the expiration date to 24 hours from now if it is not set or if it is set to a date in the past
      dailyBoostersExp:
        user.dailyBoostersExp && user.dailyBoostersExp > new Date()
          ? user.dailyBoostersExp
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // Return the response
  return {
    message: "Successfully updated user's free daily boosters",
    data: updatedUser,
  };
}

export async function updateBoostRefillEndTime(req: NextRequest) {
  // Use search params to get the userId
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  const userId = searchParams.get("userId");

  const refillEndTime = searchParams.get("refillEndTime");

  // Check if all required fields are provided
  if (!userId || !refillEndTime) {
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

  // If user exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Update the user's boost refill time
  const updatedUser = await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      boostRefillEndTime: new Date(refillEndTime),
    },
  });

  // Return the response
  return {
    ...updatedUser,
  };
}

export async function fetchBoostRefillEndTime(req: NextRequest) {
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
      userId: userId,
    },
  });

  // If user exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Return the response
  return {
    message: "Successfully fetched user's boost refill end time",
    data: user,
  };
}

async function incrementUserTotalPoints(
  points: number,
  userId: string,
  currentPoints: number
) {
  await prisma.users.update({
    where: {
      userId: userId,
    },
    data: {
      totalPoints: currentPoints + points,
    },
  });
}

export async function updateUserLevel(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as MultiLevelRequest;

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

  // get the user's current level
  const currentLevel = user.level;

  // define the maximum level
  const maximumLevel = levels.length;

  // If the user's level is already at the maximum level, return error
  if (currentLevel >= maximumLevel) {
    return {
      error: ApplicationError.MaximumLevelReached.Text,
      errorCode: ApplicationError.MaximumLevelReached.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // initialize the requested level
  const requestedLevel = levels.find((level) => level.level === request.level);

  // If the level requested is not valid, return error
  if (!requestedLevel) {
    return {
      error: ApplicationError.InvalidLevelRequested.Text,
      errorCode: ApplicationError.InvalidLevelRequested.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // initialize the level fee
  const requestedLevelFee = requestedLevel.fee;

  console.log("🚀 ~ updateUserLevel ~ requestedLevelFee:", requestedLevelFee);
  console.log("🚀 ~ updateUserLevel ~ points:", user.totalPoints);

  // Check if the level is to be paid with TON
  if (requestedLevel.ton) {
    // Update the user's level and update the ton spent
    const updatedUser = await prisma.users.update({
      where: {
        userId: request.userId,
      },
      data: {
        level: request.level,
        tonSent: {
          increment: requestedLevel.ton,
        },
      },
    });

    // Return the response
    return { message: "Successfully updated user's level", data: updatedUser };
  }

  // Check if the user's totalPoints are enough to level up
  if (user.totalPoints < requestedLevelFee) {
    return {
      error: ApplicationError.NotEnoughPointsToUpgradeLevel.Text,
      errorCode: ApplicationError.NotEnoughPointsToUpgradeLevel.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Update the user's level and deduct the level fee from the user's points
  const updatedUser = await prisma.users.update({
    where: {
      userId: request.userId,
    },
    data: {
      level: request.level,
      totalPoints: {
        decrement: requestedLevelFee,
      },
    },
  });

  // Return the response
  return { message: "Successfully updated user's level", data: updatedUser };
}

export async function updateTotalNumberOfRolls(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as {
    rolls: number;
    userId: string;
  };

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

  // Update the user's total dice rolls
  const updatedUser = await prisma.users.update({
    where: {
      userId: request.userId,
    },
    data: {
      totalDiceRolls: {
        increment: request.rolls,
      },
    },
  });

  // Return the response
  return {
    message: "Successfully updated user's total dice rolls",
    data: updatedUser,
  };
}

async function addWallet(request: {
  userId: string;
  walletAddress: string;
  walletType: string;
}) {
  console.log("🚀 ~ walletType:", request.walletType);
  console.log("🚀 ~ walletAddress:", request.walletAddress);
  console.log("🚀 ~ userId:", request.userId);

  // Check if wallet already exists
  const existingWallet = await prisma.connectedWallets.findUnique({
    where: {
      walletType_walletAddress: {
        walletAddress: request.walletAddress,
        walletType: request.walletType,
      },
    },
  });

  if (existingWallet) {
    console.log("Wallet already connected");
    return;
  }

  // Create the wallet if it doesn't exist and link it to the user
  const updatedUser = await prisma.users.update({
    where: { userId: request.userId },
    data: {
      connectedWallets: {
        create: {
          walletAddress: request.walletAddress,
          walletType: request.walletType,
        },
      },
    },
  });

  console.log("Wallet added:", updatedUser);
}
