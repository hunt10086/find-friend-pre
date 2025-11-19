import { type AxiosRequestConfig } from "axios";
/**
 * 根据队伍名搜索队伍
 * /team/search
 */
export declare function getTeamSearch(params: GetTeamSearchParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        teamName: string;
        description: string;
        maxNum: number;
        userId: number;
        status: number;
        createTime: string;
        updateTime: string;
        password: string;
        icon: string;
        nowNum: number;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetTeamSearchParams {
    teamName: string;
}
