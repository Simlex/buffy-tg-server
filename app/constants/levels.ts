import { Level as LevelEnum } from "../enums/ILevel";
import { Level } from "../models/ILevel";

export const levels: Level[] = [
    {
        level: LevelEnum.Level1,
        fee: 0,
    },
    {
        level: LevelEnum.Level2,
        fee: 30000,
    },
    {
        level: LevelEnum.Level3,
        fee: 65000,
    },
    {
        level: LevelEnum.Level4,
        fee: 0,
        ton: 0.1,
    },
    {
        level: LevelEnum.Level5,
        fee: 0,
        ton: 0.2,
    },
    {
        level: LevelEnum.Level6,
        fee: 0,
        ton: 0.4,
    },
    {
        level: LevelEnum.Level7,
        fee: 0,
        ton: 0.8,
    },
    {
        level: LevelEnum.Level8,
        fee: 0,
        ton: 1.6,
    },
    {
        level: LevelEnum.Level9,
        fee: 0,
        ton: 3.2,
    },
    {
        level: LevelEnum.Level10,
        fee: 0,
        ton: 6.4,
    },
]