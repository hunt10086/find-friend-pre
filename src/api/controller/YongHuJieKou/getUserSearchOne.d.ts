import { type AxiosRequestConfig } from "axios";
/**
 * 查询单个用户
 * /user/searchOne
 */
export declare function getUserSearchOne(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
