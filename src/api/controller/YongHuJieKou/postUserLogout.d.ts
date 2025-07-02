import { type AxiosRequestConfig } from "axios";
/**
 * 用户注销
 * /user/logout
 */
export declare function postUserLogout(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
