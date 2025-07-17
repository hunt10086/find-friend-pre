import { type AxiosRequestConfig } from "axios";
/**
 * /teamUser/list
 */
export declare function getTeamUserList(params: GetTeamUserListParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        userName: string;
        userAccount: string;
        avatarUrl: string;
        gender: number;
        tags: string;
        userPassword: string;
        phone: string;
        email: string;
        userStatus: number;
        createTime: string;
        updateTime: string;
        isDelete: number;
        userRole: number;
        profile: string;
        latitude: number;
        longitude: number;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetTeamUserListParams {
    teamId: number;
}
