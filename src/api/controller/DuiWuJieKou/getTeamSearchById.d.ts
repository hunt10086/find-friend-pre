import { type AxiosRequestConfig } from "axios";
/**
 * 根据id查找队伍
 * /team/searchByID
 */
export declare function getTeamSearchById(params: GetTeamSearchByIdParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: number;
    message: string;
    description: string;
}, any>>;
export interface GetTeamSearchByIdParams {
    teamId: number;
}
