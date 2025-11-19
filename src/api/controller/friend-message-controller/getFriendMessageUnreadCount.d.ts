import { type AxiosRequestConfig } from "axios";
/**
 * 获取未读消息数量
 * /friendMessage/unreadCount
 */
export declare function getFriendMessageUnreadCount(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: number;
    message: string;
    description: string;
}, any>>;
