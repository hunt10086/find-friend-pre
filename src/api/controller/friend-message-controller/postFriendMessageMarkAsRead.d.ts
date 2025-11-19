import { type AxiosRequestConfig } from "axios";
/**
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
