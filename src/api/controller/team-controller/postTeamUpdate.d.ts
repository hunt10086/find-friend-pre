import { type AxiosRequestConfig } from "axios";
import { type TeamDto } from "../../interface";
/**
 * 更新队伍
 * /team/update
 */
export declare function postTeamUpdate(params: PostTeamUpdateParams, input: TeamDto, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
export interface PostTeamUpdateParams {
    id: number;
}
