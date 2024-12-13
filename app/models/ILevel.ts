import { Level as LevelEnum } from "../enums/ILevel";

export interface Level {
  level: LevelEnum;
  fee: number;
  ton?: number;
}

export interface MultiLevelRequest {
  level: LevelEnum;
  userId: string;
  tonPaid?: number;
}
