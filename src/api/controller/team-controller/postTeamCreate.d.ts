import { type AxiosRequestConfig } from "axios";
import { type CreateTeamRequest } from "../../interface";
/**
 * 创建队伍
 * /team/create
 */
export declare function postTeamCreate(input: CreateTeamRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
