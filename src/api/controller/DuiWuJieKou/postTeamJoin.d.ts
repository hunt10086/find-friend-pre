import { type AxiosRequestConfig } from "axios";
import { type TeamDto } from "../../interface";
/**
 * 加入队伍
 * /team/join
 */
export declare function postTeamJoin(params: PostTeamJoinParams, input: TeamDto, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
export interface PostTeamJoinParams {
    password: string;
}
