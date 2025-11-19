import { type AxiosRequestConfig } from "axios";
/**
 * /friendMessage/unreadCount
 */
export declare function getFriendMessageUnreadCount(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: number;
    message: string;
    description: string;
}, any>>;
