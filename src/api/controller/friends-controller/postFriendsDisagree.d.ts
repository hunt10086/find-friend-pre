import { type AxiosRequestConfig } from "axios";
import { type FriendRequests } from "../../interface";
/**
 * 拒绝好友申请
 * /friends/disagree
 */
export declare function postFriendsDisagree(input: FriendRequests, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
