import { type AxiosRequestConfig } from "axios";
/**
 * 展示当前用户信息
 * /user/current
 */
export declare function getUserCurrent(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
        isdelete: number;
        userRole: number;
        profile: string;
    };
    message: string;
    description: string;
}, any>>;
