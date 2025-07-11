import { type AxiosRequestConfig } from "axios";
/**
 * 获取队伍列表
 * /team/list
 */
export declare function getTeamList(params: GetTeamListParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetTeamListParams {
    count: number;
}
