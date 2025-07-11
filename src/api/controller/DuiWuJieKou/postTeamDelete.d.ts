import { type AxiosRequestConfig } from "axios";
import { type TeamDto } from "../../interface";
/**
 * 删除队伍
 * /team/delete
 */
export declare function postTeamDelete(input: TeamDto, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
