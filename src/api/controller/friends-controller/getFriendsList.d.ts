import { type AxiosRequestConfig } from "axios";
/**
 * 获取好友列表
 * /friends/list
 */
export declare function getFriendsList(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
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
