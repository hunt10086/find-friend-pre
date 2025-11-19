import { type AxiosRequestConfig } from "axios";
/**
 * 删除好友
 * /friends/delete
 */
export declare function postFriendsDelete(input: number, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
