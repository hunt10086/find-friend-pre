import { type AxiosRequestConfig } from "axios";
import { type TeamChatMessageRequest } from "../../interface";
/**
 * /api/teamChat/send
 */
export declare function postApiTeamChatSend(input: TeamChatMessageRequest, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<{
    code: number;
    data: boolean;
    message: string;
    description: string;
}, any>>;
