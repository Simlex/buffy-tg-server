import { Game } from "../enums/Game";
import { Task } from "../enums/ITask";

export interface PointsUpdateRequest {
    userId: string;
    points: number;
    task?: Task;
    game?: Game;
    ton?: number;
    nft?: number;
    accountMetrics?: 'age' | 'messages';
}