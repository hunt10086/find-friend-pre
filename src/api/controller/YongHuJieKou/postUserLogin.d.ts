import { type AxiosRequestConfig } from "axios";
import { type UserLoginRequest } from "../../interface";
/**
 * 登录请求
 * /user/login
 */
export declare function postUserLogin(input: UserLoginRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
    };
    message: string;
    description: string;
}, any>>;
