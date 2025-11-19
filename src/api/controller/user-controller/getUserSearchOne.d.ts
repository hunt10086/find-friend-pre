import { type AxiosRequestConfig } from "axios";
/**
 * 根据id查询
 * /user/search/one
 */
export declare function getUserSearchOne(params: GetUserSearchOneParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
    };
    message: string;
    description: string;
}, any>>;
export interface GetUserSearchOneParams {
    id: number;
}
