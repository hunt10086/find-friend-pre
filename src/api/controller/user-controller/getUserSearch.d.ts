import { type AxiosRequestConfig } from "axios";
/**
 * 查询所有用户
 * /user/search
 */
export declare function getUserSearch(params: GetUserSearchParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
export interface GetUserSearchParams {
    username: string;
}
