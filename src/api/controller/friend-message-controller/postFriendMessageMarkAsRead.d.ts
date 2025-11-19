import { type AxiosRequestConfig } from "axios";
/**
 * 标记消息为已读
 * /friendMessage/markAsRead
 */
export declare function postFriendMessageMarkAsRead(params: PostFriendMessageMarkAsReadParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
export interface PostFriendMessageMarkAsReadParams {
    friendId: number;
}
