import { Game } from "../enums/Game";
import { Task } from "../enums/ITask";

export interface PointsUpdateRequest {
    userId: string;
    points: number;
    task?: Task;
    game?: Game;
    accountMetrics?: 'age' | 'messages'
}