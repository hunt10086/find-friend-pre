import { type AxiosRequestConfig } from "axios";
/**
 * 主页用户推荐
 * /user/listLike
 */
export declare function getUserListLike(params: GetUserListLikeParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetUserListLikeParams {
    count: number;
}
