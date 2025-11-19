import { type AxiosRequestConfig } from "axios";
/**
 * 展示创建的队伍列表
 * /team/myTeam
 */
export declare function getTeamMyTeam(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
