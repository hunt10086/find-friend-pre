import { type AxiosRequestConfig } from "axios";
/**
 * 展示加入队伍列表
 * /team/joinTeam
 */
export declare function getTeamJoinTeam(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
