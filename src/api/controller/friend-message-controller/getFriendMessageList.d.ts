import { type AxiosRequestConfig } from "axios";
/**
 * 获取与指定好友的聊天记录
 * /friendMessage/list
 */
export declare function getFriendMessageList(params: GetFriendMessageListParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        senderId: number;
        receiverId: number;
        messageContent: string;
        sendTime: string;
        status: number;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetFriendMessageListParams {
    friendId: number;
}
