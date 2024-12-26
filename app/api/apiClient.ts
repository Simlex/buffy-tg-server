import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { UserProfileInformation } from "../models/IUser";
import { PointsUpdateRequest } from "../models/IPoints";
import {
  BonusClaimRequest,
  ReferralCreationRequest,
} from "../models/IReferral";
import { MultiLevelRequest } from "../models/ILevel";
import { TriviaUpdateRequest } from "../models/ITrivia";

export const BaseUrl = ApiRoutes.BASE_URL_LIVE;

export const API = axios.create({
  baseURL: BaseUrl,
});

//#region user

export function useCreateUser() {
  async function createUser(user: UserProfileInformation) {
    return API.post(ApiRoutes.Users, user);
  }

  return createUser;
}

export function useFetchUserInformation() {
  async function fetchUserInformation(userId: string) {
    return API.get(`${ApiRoutes.Users}?userId=${userId}`);
  }

  return fetchUserInformation;
}

// export function useFetchUserAccountMetrics() {
//   async function fetchUserAccountMetrics(userId: string) {
//     return API.get(`${ApiRoutes.UsersAccount}?userId=${userId}`);
//   }

//   return fetchUserAccountMetrics;
// }

export function useFetchUserInformationByUserName() {
  async function fetchUserInformationByUserName(data: {
    username?: string;
    userId?: string;
  }) {
    return API.get(
      `${ApiRoutes.Users}${data.username ? `?userName=${data.username}` : ""}${
        data.userId ? `?userId=${data.userId}` : ""
      }`
    );
  }

  return fetchUserInformationByUserName;
}

export function useUpdateUserPoints() {
  async function updateUserPoints(data: PointsUpdateRequest) {
    return API.post(ApiRoutes.Points, data);
  }

  return updateUserPoints;
}

export function useUpdateUserLevels() {
  async function updateUserLevels(data: MultiLevelRequest) {
    return API.post(ApiRoutes.UsersMultiLevels, data);
  }

  return updateUserLevels;
}

export function useUpdateBoostRefillEndTime() {
  async function updateBoostRefillEndTime(data: {
    userId: string;
    refillEndTime: Date;
  }) {
    return API.post(
      `${ApiRoutes.UsersBoostRefillEndTime}?userId=${data.userId}&refillEndTime=${data.refillEndTime}`
    );
  }

  return updateBoostRefillEndTime;
}

export function useFetchUserBoostRefillEndTime() {
  async function fetchUserBoostRefillEndTime(userId: string) {
    return API.get(`${ApiRoutes.UsersBoostRefillEndTime}?userId=${userId}`);
  }

  return fetchUserBoostRefillEndTime;
}

export function useCreateReferral() {
  async function createReferral(data: ReferralCreationRequest) {
    return API.post(ApiRoutes.Referrals, data);
  }

  return createReferral;
}

export function useFetchReferralLeaderboard() {
    async function fetchReferralLeaderboard() {
        return API.get(ApiRoutes.ReferralLeaderboard);
    }
    
    return fetchReferralLeaderboard;
}

export function useClaimReferralBonus() {
  async function claimReferralBonus(data: BonusClaimRequest) {
    return API.post(ApiRoutes.ReferralBonus, data);
  }

  return claimReferralBonus;
}

export function useFetchLeaderboard() {
  async function fetchLeaderboard() {
    return API.get(ApiRoutes.Leaderboard);
  }

  return fetchLeaderboard;
}

export function useUpdateDailyBoosts() {
  async function updateDailyBoosts(userId: string, mode: "fetch" | "update") {
    return API.post(
      `${ApiRoutes.UsersDailyBoosts}/?userId=${userId}&mode=${mode}`
    );
  }

  return updateDailyBoosts;
}

export function useUpdateUserRollsPoints() {
  async function updateUserRollsPoints(data: PointsUpdateRequest) {
    return API.post(ApiRoutes.UsersRolls, data);
  }

  return updateUserRollsPoints;
}

export function useUpdateUsersRollsStreakPoints() {
  async function updateUsersRollsStreakPoints(userId: string) {
    return API.post(ApiRoutes.UsersRollsStreak(userId));
  }

  return updateUsersRollsStreakPoints;
}

export function useUpdateUserTriviaPoints() {
  async function updateUserTriviaPoints(
    userId: string,
    data: TriviaUpdateRequest
  ) {
    return API.post(ApiRoutes.UsersTrivia(userId), data);
  }

  return updateUserTriviaPoints;
}

export function useFetchBotUsers() {
  async function fetchBotUsers(passkey: string) {
    return API.get(ApiRoutes.Admin(passkey));
  }

  return fetchBotUsers;
}

export function useRestrictBotUser() {
  async function restrictBotUser(passkey: string, userId: string) {
    return API.delete(ApiRoutes.RestricBotUser(passkey, userId));
  }

  return restrictBotUser;
}

//#endregion
