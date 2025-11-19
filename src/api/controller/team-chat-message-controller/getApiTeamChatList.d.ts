import { type AxiosRequestConfig } from "axios";
/**
 * 获取队伍消息列表
 * /api/teamChat/list
 */
export declare function getApiTeamChatList(params: GetApiTeamChatListParams, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: {
        id: number;
        teamId: number;
        userId: number;
        userName: string;
        content: string;
        createTime: string;
        avatarUrl: string;
    }[];
    message: string;
    description: string;
}, any>>;
export interface GetApiTeamChatListParams {
    teamId: number;
}
