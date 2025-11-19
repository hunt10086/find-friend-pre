import { type AxiosRequestConfig } from "axios";
/**
 * 附近用户
 * /user/nearUser
 */
export declare function getUserNearUser(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        userName: string;
        avatarUrl: string;
        tags: string;
        profile: string;
        distance: number;
    }[];
    message: string;
    description: string;
}, any>>;
