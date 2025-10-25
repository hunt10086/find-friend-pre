import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseBoolean, type DeepRequired, type TeamChatMessageRequest } from "../../interface";

/**
 * /api/teamChat/send
 */
export function postApiTeamChatSend(input: TeamChatMessageRequest, config?: AxiosRequestConfig) {
    return request.post<DeepRequired<BaseResponseBoolean>>(`/api/teamChat/send`, input, config);
}
