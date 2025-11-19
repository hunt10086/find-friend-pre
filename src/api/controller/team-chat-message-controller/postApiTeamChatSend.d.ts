import { type AxiosRequestConfig } from "axios";
import { type TeamChatMessageRequest } from "../../interface";
/**
 * 发送队伍聊天消息
 * /api/teamChat/send
 */
export declare function postApiTeamChatSend(input: TeamChatMessageRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
