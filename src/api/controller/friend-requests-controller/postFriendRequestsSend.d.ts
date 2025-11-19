import { type AxiosRequestConfig } from "axios";
import { type FriendRequestsRequest } from "../../interface";
/**
 * 发送好友申请
 * /friendRequests/send
 */
export declare function postFriendRequestsSend(input: FriendRequestsRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
