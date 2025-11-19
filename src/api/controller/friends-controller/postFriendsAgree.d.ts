import { type AxiosRequestConfig } from "axios";
import { type FriendRequests } from "../../interface";
/**
 * 同意好友申请
 * /friends/agree
 */
export declare function postFriendsAgree(input: FriendRequests, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
