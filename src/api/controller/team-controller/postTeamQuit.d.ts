import { type AxiosRequestConfig } from "axios";
import { type TeamDto } from "../../interface";
/**
 * 退出队伍
 * /team/quit
 */
export declare function postTeamQuit(input: TeamDto, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
