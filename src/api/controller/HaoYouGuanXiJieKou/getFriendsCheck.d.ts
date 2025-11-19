import { type AxiosRequestConfig } from "axios";
/**
 * 检查是否为好友
 * /friends/check
 */
export declare function getFriendsCheck(params: GetFriendsCheckParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        userName: string;
        avatarUrl: string;
        tags: string;
        profile: string;
        distance: number;
    };
    message: string;
    description: string;
}, any>>;
export interface GetFriendsCheckParams {
    friendUserId: number;
}
