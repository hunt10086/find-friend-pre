import { type AxiosRequestConfig } from "axios";
/**
 * /team/get/team
 */
export declare function getTeamGetTeam(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
