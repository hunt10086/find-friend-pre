import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListTeamChatMessageVo, type DeepRequired } from "../../interface";

/**
 * /api/teamChat/list
 */
export function getApiTeamChatList(params: GetApiTeamChatListParams, config?: AxiosRequestConfig) {
    const paramsInput = {
        teamId: params.teamId,
    };
    return request.get<DeepRequired<BaseResponseListTeamChatMessageVo>>(`/api/teamChat/list`, {
        params: paramsInput,
        ...config,
    });
}

export interface GetApiTeamChatListParams {
    teamId: number;
}
