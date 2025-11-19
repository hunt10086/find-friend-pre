import { type AxiosRequestConfig } from "axios";
/**
 * 获取好友申请列表
 * /friendRequests/list
 */
export declare function getFriendRequestsList(config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        fromUserId: number;
        toUserId: number;
        message: string;
        status: number;
        createTime: string;
        updateTime: string;
    }[];
    message: string;
    description: string;
}, any>>;
